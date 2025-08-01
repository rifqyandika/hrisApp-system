require('dotenv').config();
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT
const cors = require('cors');
const employee = require('./src/routes/api/v1/employeeRoute')
const connectDB = require('./src/config/mongodb');

connectDB(); 
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/api/v1/employee', employee)

app.listen(port, () => {
    console.log(`Server running at port ${port}`)
})