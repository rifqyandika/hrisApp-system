const express = require('express')
const route = express.Router()
const { getPresence, signPresence, signoutPresence, getPresenceByEmployee } = require('../../../controller/presenceController')

route.get('/', getPresence)
route.get('/:employee_id', getPresenceByEmployee)
route.post('/signin', signPresence)
route.post('/signout', signoutPresence)

module.exports = route