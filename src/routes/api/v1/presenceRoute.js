const express = require('express')
const route = express.Router()
const { getPresence, addPresence } = require('../../../controller/presenceController')

route.get('/', getPresence)
route.post('/add', addPresence)

module.exports = route