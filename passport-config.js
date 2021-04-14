const localStrategy = require('passport-local').Strategy



function initialize(passport) {
  const authenticateUser = (username, password, done) => {
    const user = getUserByUsername(username)
    if (user == null) {
      return done(null, false, { meassage: 'No user with that username' })
    }
  }

  passport.use(new localStrategy({ usernameField: 'username' }), authenticateUser)
  passport.serializeUser((user, done) => {  })
  passport.deserializeUser((id, done) => {  })
}