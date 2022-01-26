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
  res.send("Hello!");
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

app.post("/login", (req, res) => {
  res.cookie("username", req.body.username);
  res.redirect("http://localhost:8080/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("http://localhost:8080/urls");
});

app.get("/register", (req, res) => {
  const templateVars = {
    user: req.cookies.user,
    userdat:users
  };
  res.render("urls_registration", templateVars);
});

app.post("/register", (req, res) => {
  
  let a = generateRandomString();
  users[a] = req.body
  users[a]["id"] = a
  console.log(users);
  if (req.body.loginNow === 'on') {
    res.cookie("user", users[a]);
  }
  res.redirect("http://localhost:8080/urls");

});