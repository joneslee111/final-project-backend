const LocalStrategy = require("passport-local").Strategy;
const { pool } = require("./dbconfig");
const bcrypt = require("bcrypt");

function initialize(passport) {
    const authenticateUser = (email, password, done) => {
        // checks to see if the user is in the database via the email param
        pool.query(`SELECT * FROM users WHERE email = $1`,[email],
            (error, results) => {
                if (error) {
                    throw error;
                }
                console.log(results.rows);
                console.log("getting here");
                // if there is a match in the email, user variable is assigned
                if (results.rows.length > 0){
                    const user = results.rows[0];
                    // uses the bcrypt compare method to see whether the password matches too
                    // isMatch will be rendered true if the passwords do match
                    bcrypt.compare(password, user.password, (error, isMatch)=>{
                        if (error) {
                            console.log("error");
                            throw error;
                        }
                        // 'done' is an in-built node function: https://stackoverflow.com/questions/28656780/what-is-the-attribute-done-in-nodejs
                        // this takes two params - first "null" (usually an error but there should be no errors at this point), 
                        // second param - returns the user. This allows the done function to store the user in the session cookie of our app.
                        if (isMatch === true) {
                            return done(null, user);
                        // isMatch is false 
                        }else{
                            return done(null, false, { message: "Incorrect Password." });
                        }
                    });
                // if the user does not exist 
                }else{
                    return done(null, false, { message: "Email is not registered." });
                }
            }
        )
    } 
    
    passport.use(
        new LocalStrategy({
          usernameField: "email",
          passwordField: "password"      
        },
        authenticateUser
        )
    );

    // stores the user id in the session
    passport.serializeUser((user, done) => done(null, user.id));

    // this method uses the id from serializeUser to attain the user's details from the database
    // this method also allows us to store the full user object into the session
    passport.deserializeUser((id, done) => {
        pool.query(`SELECT * FROM users WHERE id = $1`, [id], (error, results) => {
                if (error){
                    throw error
                }else{
                    return done(null, results.rows[0])
                }
            }
        )
    })
}
// exporting the large initialize function created above (used in the server.js file)
module.exports = initialize;