const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
//const morgan = require("morgan");
const cookieParser = require('cookie-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(cookieParser());
//app.use(morgan('dev'));


function generateRandomString() {
  let char = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
  result = '';
  for (let i = 0; i < 6; i++) {
    result += char[Math.floor(Math.random() * char.length)];
  }
  return result;
}

function findEmail(email) {
  for (let user in users) {
    if (email === users[user].email) {
      return users[user]
    }
  } return false;
}
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}


app.get("/", (req, res) => {
  res.redirect("http://localhost:8080/urls");
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
  const templateVars = { urls: urlDatabase, user: req.cookies.user, userdat:users };
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  let a = generateRandomString();
  urlDatabase[a] = req.body.longURL;
  res.redirect('http://localhost:8080/urls/' + a);
});

app.get("/urls/new", (req, res) => {
  const templateVars = {
    user: req.cookies.user,
    userdat:users
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { user: req.cookies.user, shortURL: req.params.shortURL, userdat:users, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  res.redirect(urlDatabase[req.params.shortURL]);
});


app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("http://localhost:8080/urls");
});

app.post("/urls/:shortURL", (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.longURL;
  res.redirect("http://localhost:8080/urls");
});

app.get("/login", (req, res) => {
  const templateVars = {
    user: req.cookies.user,
    userdat:users
  };
  res.render("login", templateVars);
});

app.post("/login", (req, res) => {
  if (findEmail(req.body.email)) {
    if (req.body.password === findEmail(req.body.email)["password"]){
      res.cookie("user", findEmail(req.body.email));
      res.redirect("http://localhost:8080/urls");
    } 
    else {
      return res.status(403).send({
        message: 'Error 403: Incorrect Password'
      });
    }
  }
  else {
    return res.status(403).send({
      message: 'Error 403: That email is not registered.'
    });
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("user");
  res.redirect("http://localhost:8080/urls");
});

app.get("/register", (req, res) => {
  const templateVars = {
    user: req.cookies.user,
    userdat:users
  };
  res.render("register", templateVars);
});

app.post("/register", (req, res) => {
  console.log(req.body.email);
  if (req.body.email === '' || req.body.password === '') {
    return res.status(400).send({
      message: 'Error 400: You must fill in both the username and password!'
   });
  }
  if (findEmail (req.body.email)) {
    return res.status(400).send({
      message: 'Error 400: That email is already registered!'
    });
  }
  let a = generateRandomString();
  users[a] = req.body
  users[a]["id"] = a
  console.log(users);
  if (req.body.loginNow === 'on') {
    res.cookie("user", users[a]);
  }
  res.redirect("http://localhost:8080/urls");

});