// Create a pool object to connect with the database
const { Pool } = require('pg') // A js object that holds the code to make and break connections with the database
require('dotenv').config()

const db = new Pool({
  connectionString: process.env.NODE_ENV === "test"
    ? process.env.DB_TEST_URL
    : process.env.DB_URL
})

module.exports = db