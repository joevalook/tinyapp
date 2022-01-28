const express = require("express");
const app = express();
const { generateRandomString, findEmail, dateNow, makeProperUrl, uniqVisits } = require("./helpers");
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const bcrypt = require('bcryptjs');
const cookieSession = require('cookie-session');
const uuid = require('uuid/v4');
const methodOverride = require('method-override')



// setting variables for the keys used in cookie session
let a = uuid();
let b = uuid();

let siteVisits = {
  b6UTxQ: {
    dateCreated: "27/1/2022 @ 1:44:52", 
    visits: 0,
    uniqueVisits: 0,
    timeStamps: [["28/1/2022 @ 1:44:52", 'asdfhkj']]
  },
  i3BoGr: {
    dateCreated:"26/1/2022 @ 1:44:52",
    visits: 0,
    uniqueVisits: 0,
    timeStamps: []
  },
}

//setting express to use body parser, cookie session and method override, as well as setting the view engine as ejs
app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(cookieSession({
  name: 'session',
  keys: [a, b]
}));

//url database with some default URLs inputted
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

//user data base with default users added. Passwords are hashed.
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync("purple-monkey-dinosaur", 10),
    visitorID: "randomVisitor1ID"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync("dishwasher-funk", 10),
    visitorID: "randomVisitor2ID"
  }
};

// home page, redirects to the URLs page if a user is logged in, redirects to login page if no one is logged in
app.get("/", (req, res) => {
  if (req.session.user) {
    res.redirect("http://localhost:8080/urls");
  } else {
    res.redirect("http://localhost:8080/login");
  }
});

// home page
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

//displays urlsDatabase in JSON format
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//displays page that has all of the URLs of the user if logged in. If not it displays a message prompting the user to log in to view their urls
app.get("/urls", (req, res) => {
  for (let url in siteVisits) {
    siteVisits[url].uniqueVisits = uniqVisits(siteVisits[url].timeStamps)
  }
  const templateVars = { urls: urlDatabase, user: req.session.user, siteVisits: siteVisits };
  res.render("urls_index", templateVars);
});

//adds a url to the database if the user is logged in
app.post("/urls", (req, res) => {
  if (req.session.user) {  //checks whether logged in
    console.log(req.body);  
    const a = generateRandomString();
    urlDatabase[a] = {};
    
    //wanted to allow input of https://www.example.ca and www.example.ca and example.ca, and create proper input of https://www.example.ca
    let longUrl = req.body.longURL;
    urlDatabase[a]["longURL"] = makeProperUrl(longUrl);
    urlDatabase[a]["userID"] = req.session.user["id"];
    siteVisits[a] = {
      dateCreated: dateNow(),
      visits: 0,
      uniqueVisits: 0,
      timeStamps: []
    },
    res.redirect('http://localhost:8080/urls/' + a);
  } else { // if user is not logged in, send error 401 message
    const templateVars = {
      errorStatus:'401 Unauthorized',
      errorMessage: 'You need to log in first to make this request',
    } 
    res.status(401)
    return res.render('error', templateVars)
  }
});

// if user is logged in it displays a page where a user can generate a random 6 character short URL for inputted long URL. redirects to login page if user is not logged in
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

// NOT PART OF INSTRUCTIONS
// created a page available in the nav bar that shows all of the URLs in the entire database. Useful because instructions say that a user can use any short URL for the /u/:shortURL path, and therefore it would be useful to see all the available shortURLS
app.get("/urls/full", (req, res) => {
  for (let url in siteVisits) {
    siteVisits[url].uniqueVisits = uniqVisits(siteVisits[url].timeStamps)
  }
  const templateVars = { urls: urlDatabase, user: req.session.user, siteVisits: siteVisits };
  res.render("urls_full", templateVars);

});

// If you are logged in and created the short URL queried the browser displays a page that shows information about the desired short URL. An edit form is also available, below this information.
app.get("/urls/:shortURL", (req, res) => {
  if (!urlDatabase[req.params.shortURL]) { //checks if shortURL exists in database
    const templateVars = {
      errorStatus:'404 Not Found',
      errorMessage: 'That short URL does not exist on this database!',
    } 
    res.status(404)
    return res.render('error', templateVars)
  }
  if (!req.session.user) { // checks if any user is logged in
    const templateVars = {
      errorStatus:'401 Unauthorized',
      errorMessage: 'You need to log in first to make this request',
    } 
    res.status(401)
    return res.render('error', templateVars)
  } else if (req.session.user.id === urlDatabase[req.params.shortURL].userID) { // checks if creator of short URL is the same as the logged in user
    siteVisits[req.params.shortURL].uniqueVisits = uniqVisits(siteVisits[req.params.shortURL].timeStamps)
    const templateVars = {
      user: req.session.user,
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL]["longURL"],
      visitors: siteVisits[req.params.shortURL],
    };
    res.render("urls_show", templateVars);
  } else { // registered user is not creator, therefore error message is displayed
    console.log(req.session.user.id);
    console.log(urlDatabase[req.params.shortURL].userID);
    const templateVars = {
      errorStatus:'403 Forbidden',
      errorMessage: 'You can not edit another user\'s tinyURL!',
    } 
    res.status(403)
    return res.render('error', templateVars)
  }
});

// accesses the corresponding longURL website
app.get("/u/:shortURL", (req, res) => {
  if (!urlDatabase[req.params.shortURL]) {
    const templateVars = {
      errorStatus:'404 Not Found',
      errorMessage: 'That short URL does not exist on this database!',
    } 
    res.status(404)
    return res.render('error', templateVars)
  }
  siteVisits[req.params.shortURL]["visits"] += 1;
  let user = "anonymous"
  if (req.session.user) {
    user = req.session.user.visitorID
  }
   
  siteVisits[req.params.shortURL]['timeStamps'].push([dateNow(), user])
  res.redirect(urlDatabase[req.params.shortURL].longURL);
});

//allows a user to delete a short URL from the database, if they are the creator
app.delete("/urls/:shortURL/delete", (req, res) => {
  if (req.session.user) { //checks if user is logged in
    if (req.session.user.id === urlDatabase[req.params.shortURL].userID) { //checks is user is creator
      delete urlDatabase[req.params.shortURL];
      res.redirect("http://localhost:8080/urls");
    } else {
      // console.log(req.session.user);
      // console.log(urlDatabase[req.params.shortURL]);
      const templateVars = {
        errorStatus:'403 Forbidden',
        errorMessage: 'You can not delete another user\'s tinyURL!',
      } 
      res.status(403)
      return res.render('error', templateVars)
    }
  } else {
    const templateVars = {
      errorStatus:'401 Unauthorized',
      errorMessage: 'You need to log in first to make this request',
    } 
    res.status(401)
    return res.render('error', templateVars)
  }


});

//if a user is the creator of the short URL, allows them to edit the short URL to refer to a different long URL
app.put("/urls/:shortURL", (req, res) => {
  if (req.session.user) {
    if (req.session.user.id === urlDatabase[req.params.shortURL].userID) {
      urlDatabase[req.params.shortURL].longURL = makeProperUrl(req.body.longURL);
      res.redirect("http://localhost:8080/urls");
    } else {
      const templateVars = {
        errorStatus:'403 Forbidden',
        errorMessage: 'You can not edit another user\'s tinyURL!',
      } 
      res.status(403)
      return res.render('error', templateVars)
    }
  } else {
    const templateVars = {
      errorStatus:'401 Unauthorized',
      errorMessage: 'You need to log in first to make this request',
    } 
    res.status(401)
    return res.render('error', templateVars)
  }
});

// displays log in page with two parameters inputted: email and password
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

// verifies user and logs them in via cookie data. Has a toggle for remember me that is not implemented yet because of insufficient knowledge
app.post("/login", (req, res) => {
  if (findEmail(users, req.body.email)) { //if email is in database
    if (bcrypt.compareSync(req.body.password, findEmail(users, req.body.email)["password"])) { //if hashed password matches hashed password on file
      req.session["user"] = findEmail(users, req.body.email); //log in via cookie
      res.redirect("http://localhost:8080/urls");
    } else {
      const templateVars = {
        errorStatus:'403 Forbidden',
        errorMessage: 'Incorrect Password',
      } 
      res.status(403)
      return res.render('error', templateVars)
    }
  } else {
    const templateVars = {
      errorStatus:'403 Forbidden',
      errorMessage: 'That email is not registered',
    } 
    res.status(403)
    return res.render('error', templateVars)
  }
});

// logs out user via clearing cookie data
app.post("/logout", (req, res) => {
  req.session.user = null; 
  res.redirect("http://localhost:8080/urls");
});

// displays register page with two parameters inputted: email and password
app.get("/register", (req, res) => {
  if (req.session.user) { //if user is already logged in, redirects to urls page
    res.redirect("http://localhost:8080/urls");
  } else {
    const templateVars = {
      user: req.session.user,
      userdat: users
    };
    res.render("register", templateVars);
  }
});

// registers user if email and password are valid. Creates a hashed password to protect private data. Allows an option to log in right away if toggled, or to just create an account if not toggled
app.post("/register", (req, res) => {
  if (req.body.email === '' || req.body.password === '') {
    const templateVars = {
      errorStatus:'400 Bad Request',
      errorMessage: 'You must fill in both the username and password!',
    } 
    res.status(400)
    return res.render('error', templateVars)
  }
  if (findEmail(users, req.body.email)) {
    const templateVars = {
      errorStatus:'400 Bad Request',
      errorMessage: 'That email is already registered!',
    } 
    res.status(400)
    return res.render('error', templateVars)
  }
  let a = generateRandomString(); //created random ID for user
  let b = generateRandomString(); //created random ID for user
  const hashedPassword = bcrypt.hashSync(req.body.password, 10); 
  req.body.password = hashedPassword;
  users[a] = req.body;
  users[a]["id"] = a;
  users[a]["visitorID"] = b
  console.log(users);
  if (req.body.loginNow === 'on') {
    req.session["user"] = users[a];
  }
  res.redirect("http://localhost:8080/urls");

});