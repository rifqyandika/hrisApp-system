require('dotenv').config();
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT
const cors = require('cors');
const connectDB = require('./src/config/mongodb');
// route
const employee = require('./src/routes/api/v1/employeeRoute')
const presence = require('./src/routes/api/v1/presenceRoute')

// setup
connectDB(); 
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// setup route master
app.use('/api/v1/employee', employee)
app.use('/api/v1/presence', presence)

// setup port
app.listen(port, () => {
    console.log(`Server running at port ${port}`)
})