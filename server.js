const express = require("express");
const app = express();
// require the db config file to connect to the right database - assigned to the constant object 'pool'
const { pool } = require("./dbConfig");
const bcrypt = require("bcrypt");
const session = require("express-session");
const flash = require("express-flash");
const passport = require("passport");
const initializePassport = require("./passportConfig");

initializePassport(passport);

const PORT = process.env.PORT || 9000;

// MIDDLEWARE

// this tells our app to render the ejs files in the views folder
app.set("view engine", "ejs"); 
// this send details from the front end to the server
app.use(express.urlencoded({ extended: false }));

app.use(
    session({
    secret: "secretSession",
    resave: false,
    saveUninitialized: false
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());


// ROUTES

// these are the app controller routes
app.get("/", (request, response) => {
    response.render("index");
});

app.get("/users/register", (request, response) => {
    response.render("register");
});

app.get("/users/login", (request, response) => {
    response.render("login");
});

// set the user variable/object to myself as a placeholder. This will print my name in the dashboard views file.
app.get("/users/dashboard", (request, response) => {
    response.render("dashboard", { user: "Rorie" });
});

app.get("/users/logout", (request, response) => {
    request.logOut();
    request.flash('success_msg', "You have successfully logged out");
    response.redirect("/users/login");
})

// retrieving the params from the register route with a post request
app.post("/users/register", async (request, response) => {
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
    }else{
        // If reaches here, form validation has passed.
        // using bcrypt to add a "salt" of "10" to the users password so we can store it in the database safely.
        let hashedPassword = await bcrypt.hash(password, 10); 
        // getting visability to see if the hash is working
        console.log(hashedPassword);
        // this looks into the database using the .query method
        // the $1 is a placeholder that gets replaced by the param '[email]' when searching through the database
        pool.query(`SELECT * FROM users WHERE email = $1`, [email],
            (error, results) => {
                if (error) {
                    throw error
                }
                // getting visibility
                console.log(results.rows);
                // email validation method, similar to the validation methods above
                if (results.rows.length > 0){
                    errors.push({ message: "Email already in use!"});
                    response.render("register", { errors });
                }else{
                    pool.query(`INSERT INTO users (name, email, username, password) VALUES ($1, $2, $3, $4)`, 
                    [name, email, username, hashedPassword],
                        (error, results) => {
                            if (error) {
                                throw error;
                            }
                            console.log(results.rows);
                            request.flash('success_msg', "Successfully created an account!")
                            response.redirect("/users/dashboard")
                        }
                    )
                }
            } 
        );
    };

});

// passport.authenticate uses the local ("Local Strategy" line 1 on passport Config). 
// This then takes an object which redirects the user based on success or failure, using passport features
// failureFlash will use the express flash methods in the passport.config initialize method.
app.post("/users/login", passport.authenticate("local", {
    successRedirect: "/users/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true
}));

app.listen(PORT, () => {
    console.log( `server running on port ${PORT}`);
});