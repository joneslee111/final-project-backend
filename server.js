const express = require("express");
const app = express();
// require the db config file to connect to the right database
const { pool } = require("./dbConfig");

const PORT = process.env.PORT || 9000;

// this tells our app to render the ejs files in the views folder
app.set("view engine", "ejs"); 
// this send details from the front end to the server
app.use(express.urlencoded({ extended: false }));

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

// set the user variable/object to myself as a placeholder. This will print my name in the dashboard views file.
app.get("/users/dashboard", (request, response) => {
    response.render("dashboard", { user: "Rorie" })
});

// retrieving the params from the register route with a post request
app.post("/users/register", (request, response) => {
    let { name, email, username, password, password_confirmation } = request.body;

// printing the params back to the console to see if it's returning anything - test passes!
    console.log({
        name,
        email,
        username,
        password,
        password_confirmation
    });

    // creating error messages to make sure input is valid. 
    let errors = [];

    if (!name || !email || !username || !password || !password_confirmation){
        errors.push({ message: "Please enter all required fields." });
    }

    if (password.length < 6){
        errors.push({ message: "Passwords should be at least 6 characters." });
    }

    if (password != password_confirmation){
        errors.push({ message: "Passwords do not match." });
    }

    // Messages all pushed to an error array. If the array has a message, the page will be refreshed with said message.
    if (errors.length > 0){
        response.render("register", { errors });
    }

});

app.listen(PORT, () => {
    console.log( `server running on port ${PORT}`);
});