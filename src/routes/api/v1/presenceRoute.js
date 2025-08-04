const express = require('express')
const route = express.Router()
const { 
    getPresence, 
    signPresence, 
    signoutPresence, 
    getPresenceByEmployee, 
    submissionPresence, 
    getWeeklyPresence,
    getMonthlyPresence,
    recapPresence,
    recapExport } = require('../../../controller/presenceController')

route.get('/', getPresence)
route.get('/recap', recapPresence)
route.get('/recap/export', recapExport)
route.get('/:employee_id', getPresenceByEmployee)
route.post('/signin', signPresence)
route.post('/signout', signoutPresence)
route.post('/submission', submissionPresence)
route.get('/:employee_id/weekly', getWeeklyPresence)
route.get('/:employee_id/monthly', getMonthlyPresence)

module.exports = route