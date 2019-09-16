var express = require('express')
var router = express.Router()
var passport = require('passport')
import { knex } from '../../server'

//this route is NOT deprecated
router.post('/', passport.authenticate('local'), async (req, res) => {
    req.user.reviews = await knex('reviews').where({ user_id: req.user.id })
    res.json(req.user)
})
export default router
