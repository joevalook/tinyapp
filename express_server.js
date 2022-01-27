const express = require("express");
const app = express();
const { generateRandomString, findEmail } = require("./helpers");
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const bcrypt = require('bcryptjs');
const cookieSession = require('cookie-session');
const uuid = require('uuid/v4');

let a = uuid();
let b = uuid();
// setting variables for the keys used in cookie session

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(cookieSession({
  name: 'session',
  keys: [a, b]
}));


const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "userRandomID"
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "userRandomID"
  }
};
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync("purple-monkey-dinosaur", 10)
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync("dishwasher-funk", 10)
  }
};


app.get("/", (req, res) => {
  if (req.session.user) {
    res.redirect("http://localhost:8080/urls");
  } else {
    res.redirect("http://localhost:8080/login");
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase, user: req.session.user, userdat: users };
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  if (req.session.user) {
    console.log(req.body);  // Log the POST request body to the console
    let a = generateRandomString();
    urlDatabase[a] = {};
    let b = req.body.longURL;
    if (b.slice(0, 4) === 'http') {
      urlDatabase[a]["longURL"] = b;
    } else if (b.slice(0, 3) === 'www') {
      urlDatabase[a]["longURL"] = "https://" + b;
    } else {
      urlDatabase[a]["longURL"] = "https://www." + b;
    }
    urlDatabase[a]["userID"] = req.session.user["id"];
    //now can allow input of https://www.google.ca and www.google.ca and google.ca, all as the same
    res.redirect('http://localhost:8080/urls/' + a);
  } else {
    return res.status(401).send({
      message: 'Error 401: You need to log in first to make this request'
    });
  }
});

app.get("/urls/new", (req, res) => {
  if (req.session.user) {
    const templateVars = {
      user: req.session.user,
      userdat: users
    };
    res.render("urls_new", templateVars);
  } else {
    res.redirect("http://localhost:8080/login");
  }
});

app.get("/urls/full", (req, res) => {
  const templateVars = { urls: urlDatabase, user: req.session.user, userdat: users };
  res.render("urls_full", templateVars);

});

app.get("/urls/:shortURL", (req, res) => {
  if (!urlDatabase[req.params.shortURL]) {
    return res.status(404).send({
      message: 'Error 404: That short URL does not exist on this database!'
    });
  }
  if (!req.session.user) {
    return res.status(401).send({
      message: 'Error 401: You need to log in first to make this request'
    });
  } else if (req.session.user.id === urlDatabase[req.params.shortURL].userID) {
    const templateVars = { user: req.session.user, shortURL: req.params.shortURL, userdat: users, longURL: urlDatabase[req.params.shortURL]["longURL"] };
    res.render("urls_show", templateVars);
  } else {
    console.log(req.session.user.id);
    console.log(urlDatabase[req.params.shortURL].userID);
    return res.status(403).send({
      message: 'Error 403: You can not edit another user\'s tinyURL!'
    });
  }
});

app.get("/u/:shortURL", (req, res) => {
  if (!urlDatabase[req.params.shortURL]) {
    return res.status(404).send({
      message: 'Error 404: That short URL does not exist on this database!'
    });
  }
  res.redirect(urlDatabase[req.params.shortURL].longURL);
});


app.post("/urls/:shortURL/delete", (req, res) => {
  if (req.session.user) {
    if (req.session.user.id === urlDatabase[req.params.shortURL].userID) {
      delete urlDatabase[req.params.shortURL];
      res.redirect("http://localhost:8080/urls");
    } else {
      // console.log(req.session.user);
      // console.log(urlDatabase[req.params.shortURL]);
      return res.status(403).send({
        message: 'Error 403: You can not delete another user\'s tinyURL!'
      });
    }
  } else {
    return res.status(401).send({
      message: 'Error 401: You need to log in first to make this request'
    });
  }


});

app.post("/urls/:shortURL", (req, res) => {
  if (req.session.user) {
    if (req.session.user.id === urlDatabase[req.params.shortURL].userID) {
      urlDatabase[req.params.shortURL].longURL = req.body.longURL;
      res.redirect("http://localhost:8080/urls");
    } else {
      return res.status(403).send({
        message: 'Error 403: You can not edit another user\'s tinyURL!'
      });
    }
  } else {
    return res.status(401).send({
      message: 'Error 401: You need to log in first to make this request'
    });
  }
});

app.get("/login", (req, res) => {
  if (req.session.user) {
    res.redirect("http://localhost:8080/urls");
  } else {
    const templateVars = {
      user: req.session.user,
      userdat: users
    };
    res.render("login", templateVars);
  }
});

app.post("/login", (req, res) => {
  if (findEmail(users, req.body.email)) {
    if (bcrypt.compareSync(req.body.password, findEmail(users, req.body.email)["password"])) {
      req.session["user"] = findEmail(users, req.body.email);
      res.redirect("http://localhost:8080/urls");
    } else {
      return res.status(403).send({
        message: 'Error 403: Incorrect Password'
      });
    }
  } else {
    return res.status(403).send({
      message: 'Error 403: That email is not registered.'
    });
  }
});

app.post("/logout", (req, res) => {
  req.session.user = null;
  res.redirect("http://localhost:8080/urls");
});

app.get("/register", (req, res) => {
  if (req.session.user) {
    res.redirect("http://localhost:8080/urls");
  } else {
    const templateVars = {
      user: req.session.user,
      userdat: users
    };
    res.render("register", templateVars);
  }
});

app.post("/register", (req, res) => {
  console.log(req.body.email);
  if (req.body.email === '' || req.body.password === '') {
    return res.status(400).send({
      message: 'Error 400: You must fill in both the username and password!'
    });
  }
  if (findEmail(users, req.body.email)) {
    return res.status(400).send({
      message: 'Error 400: That email is already registered!'
    });
  }
  let a = generateRandomString();
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  req.body.password = hashedPassword;
  users[a] = req.body;
  users[a]["id"] = a;
  console.log(users);
  if (req.body.loginNow === 'on') {
    req.session["user"] = users[a];
  }
  res.redirect("http://localhost:8080/urls");

});