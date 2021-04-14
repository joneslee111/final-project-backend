const express = require('express')
const app = express()
const bcrypt = require ('bcrypt')
const passport = require('passport')

const initializePassport  = require('./passport-config')
initializePassport(passport)

app.set('view-engine', 'ejs')

app.use(express.urlencoded({ extended: false }))

const users = [];


app.get('/', (req, res) => {
  res.render('index.ejs', { name: 'USER' });
});

app.get('/login', (req, res) => {
  res.render('login.ejs');
});

app.post('/login', (req, res) => {
  
});

app.get('/register', (req, res) => {
  res.render('register.ejs');
});

app.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    // push user to database here
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      username: req.body.email,
      password: hashedPassword
    })
    res.redirect('/login')
  } catch {
    res.redirect('/register')
  }
});



app.listen(3000)