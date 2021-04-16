// requiring the environment variables saved in the .env file.
require("dotenv").config();

// requires the pg module that's been installed.
const { Pool } = require("pg");

// this is a boolean variable that looks to see if the app host is in production.
const isProduction = process.env.NODE_ENV === "production";

// this connects to the local database using the variables from the .env file
const connectionString = `postgresql://${process.env.DB_USER}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;

// initalise a new pool variable - to see if the app is in production. If not in production, connect to the local database using the connectionStrig above 
const pool = new Pool({
  connectionString: isProduction ? process.env.DATABASE_URL : connectionString
})

module.exports = { pool };