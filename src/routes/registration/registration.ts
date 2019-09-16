var express = require('express')
var router = express.Router()
var bcrypt = require('bcrypt')
import { toDB } from '../../utils'
const moment = require('moment')

import { knex } from '../../server'
export const SALT_WORK_FACTOR = 10

router.post('/', async (req, res) => {
    var user = {
        password: req.body.password,
        firstName: req.body.firstName || '',
        lastName: req.body.lastName || '',
        email: req.body.email,
        created: moment(),
        updated: moment(),
    }

    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR)
    const hash = await bcrypt.hash(user.password, salt)
    user.password = hash

    try {
        await knex('users').insert(toDB(user))
        res.status(200).send('Registration Successful')
    } catch (e) {
        res.status(500).send(e)
    }
})

export default router
