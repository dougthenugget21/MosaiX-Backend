const fs = require("fs")
require('dotenv').config()

const sql = fs.readFileSync(__dirname + '/setup-db.sql').toString()

const db = require('./connect.js')
const { error } = require('console')

db.query(sql)
    .then(data => console.log('Setup-complete'))
    .catch(error => console.log(error))
