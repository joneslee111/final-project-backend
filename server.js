const express = require("express");
const app = express();
// require the db config file to connect to the right database - assigned to the constant object 'pool'
const { pool } = require("./dbConfig");
const bcrypt = require("bcrypt");
const session = require("express-session");
const flash = require("express-flash");
const passport = require("passport");
const initializePassport = require("./passportConfig");
const fetch = require("node-fetch");
const pg = require("pg");
const cors = require("cors");
const { request } = require("express");

initializePassport(passport);

const PORT = process.env.PORT || 9000;

// MIDDLEWARE

// this tells our app to render the ejs files in the views folder
app.set("view engine", "ejs");

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))

// parse application/json
app.use(express.json())

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
app.use(cors());

// ROUTES

// these are the app controller routes
app.get("/", async (request, response) => {
    try {
        const level = request.headers.level;
        console.log(level);
        const recipes = await pool.query("SELECT * FROM curated_recipes WHERE level = $1", [level]);
        response.json(recipes)
    } catch (err) {
        console.error(err.message)
    };
});

// app.get("/users/register", checkAuthenticated, (request, response) => {
//     response.render("register");
// });

// app.get("/users/login", checkAuthenticated, (request, response) => {
//     response.render("login");
// });

// set the user variable/object to myself as a placeholder. This will print my name in the dashboard views file.
app.get("/users/dashboard", checkNotAuthenticated, (request, response) => {
    response.render("dashboard", { user: request.user.name, level: request.user.cooking_level });
});

app.get("/users/logout", (request, response) => {
    request.logOut();
    request.flash('success_msg', "You have successfully logged out");
    response.redirect("/users/login");
})

// retrieving the params from the register route with a post request
app.post("/users/register", async (request, response) => {
    let { name, email, username, password, password_confirmation, cooking_level } = request.body;

    // printing the params back to the console to see if it's returning anything - test passes!
    // console.log({
    //     name,
    //     email,
    //     username,
    //     password,
    //     password_confirmation,
    //     cooking_level
    // });

    // creating error messages to make sure input is valid.
    let errors = [];

    if (!name || !email || !username || !password || !password_confirmation || !cooking_level){
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
        // Send the errors back to the client ... the client can figure out how to deal with them
        response.json({ errors })
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
                // getting visibility 😍
                console.log(results.rows);
                // email validation method, similar to the validation methods above
                if (results.rows.length > 0){
                    errors.push({ message: "Email already in use!"});
                    response.json({ errors });
                }else{
                    pool.query(`INSERT INTO users (name, email, username, password, cooking_level, points) VALUES ($1, $2, $3, $4, $5, ${cooking_level * 100}) RETURNING *`,
                    [name, email, username, hashedPassword, cooking_level],
                        (error, results) => {
                            if (error) {
                                throw error;
                            }
                            
                            // request.flash('success_msg', "Successfully created an account! Please log in")
                            response.json({ data: results.rows[0] })
                            console.log(results.rows)
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
app.post("/users/login", passport.authorize("local"), (req, res) => {
    let { email, password } = req.body;
    pool.query(`SELECT * FROM users WHERE email = $1`, [email],
    (error, results) => {
        if (error) {
            throw error
        }

        return res.json({ data: results.rows[0]})
    })
})

function checkAuthenticated(request, response, next){
    // if a user is authenticated, they'll be re-directed to the dashboard
    // isAuthenticated is a passport method which checks if the user is authenticated
    if (request.isAuthenticated()){
        return response.redirect("/users/dashboard");
    }
    // otherwise, move on to the next piece of MIDDLEWARE.
    next();
};

function checkNotAuthenticated(request, response, next){
    // if a user is not authenticated, they'll be re-directed to the login page.
    // isAuthenticated is a passport method which checks if the user is authenticated.
    if (request.isAuthenticated()) {
        // if user is authenticated, move onto the next piece of Middle ware.
        return next()
      }
      response.redirect("/users/login");
};

app.listen(PORT, () => {
    console.log( `server running on port ${PORT}`);
});


// const R = require('ramda')
const API_KEY = "36a625081590440285cabb596440609b";

app.use(express.static('public'));

app.get("/fetch_recipe", async (req, res) => {
  console.log("/fetch_recipe endpoint called");
//   const fromNumber = req.params.from
//   const toNumber = req.params.to
  const url = `https://api.spoonacular.com/recipes/complexSearch/?diet=vegan&instructionsRequired=true&apiKey=${API_KEY}`;
  const options = {
    "method": "GET"
  };
  const apiResponse = await fetch(url, options);
  const jsonApiResponse = await apiResponse.json();

  console.log("RESPONSE: ", jsonApiResponse);

  return res.json(jsonApiResponse);
});


module.exports = app;
