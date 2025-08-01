const express = require('express')
const route = express.Router()
const { allEmployee, addEmployee, getEmployee, updateEmployee, deleteEmploye } = require('../../../controller/employeeController')

route.get('/', allEmployee)
route.get('/:id', getEmployee)
route.put('/:id', updateEmployee)
route.delete('/:id', deleteEmploye)
route.post('/add', addEmployee)

module.exports = route