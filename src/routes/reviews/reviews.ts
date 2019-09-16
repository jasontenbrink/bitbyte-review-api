const express = require('express')

const router = express.Router()
import { knex } from '../../server'
import { toDB, fromDB } from '../../utils'
import { Response } from 'express-serve-static-core'
const moment = require('moment')

router
    .route('/')
    .post(async (req, res: Response) => {
        try {
            await knex('reviews').insert(
                toDB({ ...req.body, created: moment(), updated: moment() })
            )
            res.status(200).send('Review added')
        } catch (e) {
            res.status(500).send(e)
        }
    })
    .put(async (req, res) => {
        const { id, created, ...review } = req.body
        try {
            await knex('reviews')
                .update(toDB({ ...review, updated: moment() }), [id])
                .where('id', id)
            res.status(200).send({ id })
        } catch (e) {
            res.status(500).send(e)
        }
    })
    .delete(async (req, res: Response) => {
        try {
            await knex('reviews')
                .where('id', req.body.id)
                .delete()
            res.status(200).send({ id: req.body.id })
        } catch (e) {
            res.status(500).send(e)
        }
    })
    .get(async (req, res) => {
        try {
            const vendors = await knex('vendors_with_reviews')
            res.json(fromDB(vendors))
        } catch (e) {
            console.log(e)
            res.status(500).send(e)
        }
    })
export default router
