const express = require('express')

const router = express.Router()
import { knex } from '../../server'
import { toDB, fromDB } from '../../utils'
import { Response } from 'express-serve-static-core'
const moment = require('moment')

router
    .post('/', async (req, res: Response) => {
        console.log('here')
        try {
            const thing = await knex('vendors').insert(
                toDB({
                    ...req.body,
                    isVerified: false,
                    created: moment(),
                    updated: moment(),
                })
            )
            console.log('thing', thing)
            res.status(200).send('Suggestion added')
        } catch (e) {
            console.log(e)
            res.status(500).send(e)
        }
    })
    .get('/', async (req, res) => {
        try {
            const suggestedVendors = await knex('vendors').where(
                'is_verified',
                false
            )
            res.json(fromDB(suggestedVendors))
        } catch (e) {
            res.status(500).send(e)
        }
    })
export default router
