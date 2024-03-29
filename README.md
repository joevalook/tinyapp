# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product

!["A picture of the analytics/edit page"](https://github.com/joevalook/tinyapp/blob/master/docs/Analytics.png?raw=true)

!["A picture of the error page"](https://github.com/joevalook/tinyapp/blob/master/docs/errorPage.png?raw=true)

!["A picture of the register page"](https://github.com/joevalook/tinyapp/blob/master/docs/register.png?raw=true)

!["a picture of the user's URLs page"](https://github.com/joevalook/tinyapp/blob/master/docs/myUrl.png?raw=true)

!["A picture of the entire URL Database with creators of URLs"](https://github.com/joevalook/tinyapp/blob/master/docs/urlDatabase.png?raw=true)




## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session
- bootstrap
- mocha and chai
- nodemon
- method-override

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.
- Run the development web server utilizing nodemon using the `npm start` command.
- If not registered, you can only see the URL database and access any short URL coded website
- Once registered and logged in, you can create URLs, see a database of the URLs you created and edit or delete URLs you created.
- The edit page holds interesting analytical information about how many times a page has been accessed.