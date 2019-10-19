var express = require('express')
var router = express.Router()
var passport = require('passport')
import { knex } from '../../server'

//this route is NOT deprecated
router.get('/', async (req, res) => {
    req.logout()
    res.status(200).send()
})
export default router
