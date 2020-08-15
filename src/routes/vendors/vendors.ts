const express = require('express')

const router = express.Router()
import { knex } from '../../server'
import { toDB } from '../../utils'
import { Response } from 'express-serve-static-core'
const moment = require('moment');



router.post('/', async (req, res: Response) => {

    try {
        const [vendorId] = await knex('vendors').insert(
            toDB({ ...req.body, created: moment(), updated: moment() }), 'id'
        )

        const review = {
            vendorId,
            userId: 1,
            comment: "",
            question1: 3,
            question2: 3,
            question3: 3,
            question4: 3,
            question5: 3,
            question6: 4,
            question7: 4,
            question8: 4,
            question9: 4,
            question10: 4,
            created: moment(),
            updated: moment()
        };

        await knex('reviews').insert(toDB(review))
        res.status(200).send('Vendor added')
    } catch (e) {
        res.status(500).send(e)
    }
})




export default router

