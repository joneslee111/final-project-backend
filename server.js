const express = require('express');
const app = express();

const PORT = process.env.PORT || 9000;

// this tells our app to render the ejs files in the views folder
app.set("view engine", "ejs"); 

// these are the app controller routes
app.get("/", (request, response) => {
    response.render("index");
});

app.get("/users/register", (request, response) => {
    response.render("register")
});

app.get("/users/login", (request, response) => {
    response.render("login")
});

app.get("/users/dashboard", (request, response) => {
    response.render("dashboard")
});

app.listen(PORT, () => {
    console.log( `server running on port ${PORT}`);
});