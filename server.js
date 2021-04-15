// const express = require("express");
// const app = express();
// // require the db config file to connect to the right database - assigned to the constant object 'pool'
// const { pool } = require("./dbConfig");
// const bcrypt = require("bcrypt");
// const session = require("express-session");
// const flash = require("express-flash");

// const PORT = process.env.PORT || 9000;

// MIDDLEWARE

// this tells our app to render the ejs files in the views folder
// app.set("view engine", "ejs"); 
// this send details from the front end to the server
// app.use(express.urlencoded({ extended: false }));

// app.use(
//     session({
//     secret: "secretSession",

//     resave: false,

//     saveUninitialized: false
//     })
// );

// app.use(flash());


// ROUTES

// these are the app controller routes
// app.get("/", (request, response) => {
//     response.render("index");
// });

// app.get("/users/register", (request, response) => {
//     response.render("register")
// });

// app.get("/users/login", (request, response) => {
//     response.render("login")
// });

// set the user variable/object to myself as a placeholder. This will print my name in the dashboard views file.
// app.get("/users/dashboard", (request, response) => {
//     response.render("dashboard", { user: "Rorie" })
// });

// // retrieving the params from the register route with a post request
// app.post("/users/register", async (request, response) => {
//     let { name, email, username, password, password_confirmation } = request.body;

// // printing the params back to the console to see if it's returning anything - test passes!
//     console.log({
//         name,
//         email,
//         username,
//         password,
//         password_confirmation
//     });

//     // creating error messages to make sure input is valid. 
//     let errors = [];

//     if (!name || !email || !username || !password || !password_confirmation){
//         errors.push({ message: "Please enter all required fields." });
//     }

//     if (password.length < 6){
//         errors.push({ message: "Passwords should be at least 6 characters." });
//     }

//     if (password != password_confirmation){
//         errors.push({ message: "Passwords do not match." });
//     }

//     // Messages all pushed to an error array. If the array has a message, the page will be refreshed with said message.
//     if (errors.length > 0){
//         response.render("register", { errors });
//     }else{
//         // If reaches here, form validation has passed.
//         // using bcrypt to add a "salt" of "10" to the users password so we can store it in the database safely.
//         let hashedPassword = await bcrypt.hash(password, 10); 
//         // getting visability to see if the hash is working
//         console.log(hashedPassword);
//         // this looks into the database using the .query method
//         // the $1 is a placeholder that gets replaced by the param '[email]' when searching through the database
//         pool.query(
//             `SELECT * FROM users WHERE email = $1`, 
//             [email],
//             (emailError, results) => {
//                 if (emailError) {
//                     throw emailError;
//                 }
//                 // getting visibility
//                 console.log(results.rows);
//                 // email validation method, similar to the validation methods above
//                 if (results.rows.length > 0){
//                     errors.push({ message: "Email already in use!"});
//                     response.render("register", { errors });
//                 }else{
//                     pool.query(
//                         `INSERT INTO users (name, email, username, password)
//                         VALUES ($1, $2, $3, $4)
//                         RETURNING id, password`, 
//                         [name, email, username, hashedPassword],
//                         (error, results) => {
//                             if (error) {
//                                 throw error;
//                             }
//                             console.log(results.rows);
//                             request.flash('success_msg', "Successfully created an account!")
//                             response.redirect("/users/dashboard")
//                         }
//                     )
//                 }
//             } 
//         );
//     };

// });

// app.listen(PORT, () => {
//     console.log( `server running on port ${PORT}`);
// });

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const app = express()
const bcrypt = require ('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const initializePassport  = require('./passport-config')
const methodOverrride = require('method-override')
// require the db config file to connect to the right database - assigned to the constant object 'pool'
const { pool } = require("./dbConfig")

initializePassport(
  passport, 
  username => users.find(user => user.username === username),
  id => users.find(user => user.id === id)
)

app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverrride('_method'))

// the below willl be replace with a database connection
// const users = [];

//this will have to move to a controller folder
app.get('/', checkAuthenticated, (req, res) => {
  res.render('index.ejs', { name: req.user.name });
});

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs');
});

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register.ejs');
});

let errors = [];

app.post('/register', checkNotAuthenticated, async (req, res) => {
  if (req.body.password != req.body.password_confirmation){
        errors.push({ message: "Passwords do not match." });
    }
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    pool.query(
    `SELECT * FROM users WHERE email = $1`, [email], (emailError, results) => {
        if (emailError) { throw emailError; }
        // getting visibility
        console.log(results.rows);
        // email validation method, similar to the validation methods above
        if (results.rows.length > 0) {
            errors.push({ message: "Email already in use!"});
            res.render("register", { errors });
        } else {
            pool.query(`INSERT INTO users (name, email, username, password) VALUES ($1, $2, $3, $4) RETURNING id, password`, 
                [name, email, username, hashedPassword],
                (error, results) => {
                    if (error) { throw error; }
                    console.log(results.rows);
                    req.flash('success_msg', "Successfully created an account!")
                    res.redirect("/login")})
          }})

    res.redirect('/login')
  } catch {
    res.redirect('/register')
  }
});

app.delete('/logout', (req, res) => {
  req.logout()
  res.redirect('/login')
})

// call this function for every route where we require the user to be auth to access
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}
// call this function for every route where we require the user to not be auth to access
function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  } 
  next()
}

app.listen(3000)

