const express = require('express')
const route = express.Router()
const { allEmployee, addEmployee, getEmployee, updateEmployee, deleteEmploye } = require('../../../controller/employeeController')
const upload = require('../../../middleware/upload')

route.get('/', allEmployee)
route.get('/:id', getEmployee)
route.put('/:id', updateEmployee)
route.delete('/:id', deleteEmploye)
route.post('/add', upload.single('foto') ,addEmployee)

module.exports = route