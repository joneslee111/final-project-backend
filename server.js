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
const http = require('http');
const url = require('url'); // to get access to url.parse to read query string parameters

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
        const level = request.query.level;
        console.log(level);
        const recipes = await (await pool.query("SELECT * FROM curated_recipes WHERE level = $1", [level]));
        // const recipes = await (await pool.query("SELECT * FROM curated_recipes WHERE level = $1", [level])).rows;

        response.json(recipes)
    } catch (err) {
        console.error(err.message)
    };
});

const API_KEY = "f601f3afe5634ecf9235684153a22291";
// other api key "https://api.spoonacular.com/recipes/"  +  recipe_id + "/information?instructionsRequired=true&apiKey=36a625081590440285cabb596440609b"

app.get("/recipe", async (req, res) => {

    try {
        const recipe_id = req.query.recipe_id;
        console.log(recipe_id);
        const url = "https://api.spoonacular.com/recipes/"  +  recipe_id + "/information?instructionsRequired=true&apiKey=f601f3afe5634ecf9235684153a22291"; //`https://api.spoonacular.com/recipes/${recipe_id}/analyzedInstructions?apiKey=${API_KEY}`;
        console.log(url)
        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        };
        const apiResponse = await fetch(url, options);
        const recipeJson = await apiResponse.json();
        console.log(recipeJson)
        return res.json(recipeJson);
    } catch (err) {
        console.error(err.message)
    };
});

app.get("/users/dashboard", checkNotAuthenticated, (request, response) => {
    response.render("dashboard", { user: request.user.name, level: request.user.cooking_level });
});

app.get("/users/logout", (request, response) => {
    request.logOut();
    request.flash('success_msg', "You have successfully logged out");
    response.redirect("/users/login");
})

app.post("/users/register", async (request, response) => {
    let { name, email, username, password, password_confirmation, cooking_level } = request.body;
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
    if (cooking_level === "null"){
        errors.push({ message: "Please enter a valid cooking level."});
    }

    // Messages all pushed to an error array. If the array has a message, the page will be refreshed with said message.
    if (errors.length > 0){
        response.json({ errors })
    } else {
        let hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);

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

                            response.json({ data: results.rows[0] })
                            console.log(results.rows)
                        }
                    )
                }
            }
        );
    };

});

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

    if (request.isAuthenticated()){
        return response.redirect("/users/dashboard");
    }
    next();
};

function checkNotAuthenticated(request, response, next){
    if (request.isAuthenticated()) {
        return next()
      }
      response.redirect("/users/login");
};

app.listen(PORT, () => {
    console.log( `server running on port ${PORT}`);
});

//changing the users points in the database, possibly the level too 🙀

app.post("/", async (request, response) => {
    let points = request.body.points + 50
    let userId = request.body.userId
    let recipeId = request.body.recipeId
    let completed = true
    let cooking_level = request.body.cookingLevel
    let errors = [];


    pool.query(`INSERT INTO completed_recipes (completed, user_id, recipe_id) VALUES( $1, $2, $3) RETURNING id, completed, user_id, recipe_id;`,
    [completed, userId, recipeId],
        (error, results) => {
            if (error) {
                throw error;
            }
            console.log(results.rows);
            if(results.rows.length > 0)
                pool.query(`UPDATE users SET points = ${points} WHERE id = ${userId} RETURNING *`, 
                (error, results) => {
                    if (error) {
                    throw error;
                }
                const data = { 
                    userId: results.rows[0].id,
                    cooking_level: results.rows[0].cooking_level, 
                    points: results.rows[0].points
                }
            response.json(data)
            })
        });
    })  




// app.use(express.static('public'));

// app.get("/fetch_recipe", async (req, res) => {
//   console.log("/fetch_recipe endpoint called");
// //   const fromNumber = req.params.from
// //   const toNumber = req.params.to
//   const url = `https://api.spoonacular.com/recipes/complexSearch/?diet=vegan&instructionsRequired=true&apiKey=${API_KEY}`;
//   const options = {
//     "method": "GET"
//   };
//   const apiResponse = await fetch(url, options);
//   const jsonApiResponse = await apiResponse.json();

//   console.log("RESPONSE: ", jsonApiResponse);

//   return res.json(jsonApiResponse);
// });


module.exports = app;
