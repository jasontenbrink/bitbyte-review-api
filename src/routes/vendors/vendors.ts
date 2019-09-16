const express = require('express')

const router = express.Router()
import { knex } from '../../server'
import { toDB } from '../../utils'
import { Response } from 'express-serve-static-core'
const moment = require('moment')

router.post('/', async (req, res: Response) => {
    try {
        await knex('vendors').insert(
            toDB({ ...req.body, created: moment(), updated: moment() })
        )
        res.status(200).send('Vendor added')
    } catch (e) {
        res.status(500).send(e)
    }
})
export default router
