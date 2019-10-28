const express = require('express')

const router = express.Router()
import { knex } from '../../server'
import { toDB, fromDB } from '../../utils'
import { Response } from 'express-serve-static-core'
const moment = require('moment')
import { mom } from '../../server'
console.log('mom', mom)
console.log('knex', knex)

export const ensureAuthenticated = (req: any, res, next) =>
    req.isAuthenticated() ? next() : res.status(401).send()

router
    .post('/', ensureAuthenticated, async (req, res: Response) => {
        // req.user = { id: 9 }
        try {
            const vendor = await knex('vendors')
                .first()
                .where('id', req.body.vendorId)
            const [newReview] = await knex('reviews')
                .returning([
                    'id',
                    'vendor_id',
                    'user_id',
                    'comment',
                    'question_1',
                    'question_2',
                    'question_3',
                    'question_4',
                    'question_5',
                    'question_6',
                    'question_7',
                    'question_8',
                    'question_9',
                    'question_10',
                    'created',
                    'updated',
                ])
                .insert(
                    toDB({
                        ...req.body,
                        userId: req.user.id,
                        created: moment(),
                        updated: moment(),
                    })
                )
            newReview.name = vendor.name
            console.log('new review', newReview)
            res.status(200).send(fromDB(newReview))
        } catch (e) {
            if (e.code && e.code == 23505) {
                // 23505 is a unique constraint violation
                return res
                    .status(403)
                    .send(
                        'You may not review a vendor twice.  You can make changes to a review from your profile.'
                    )
            }
            console.log(e)
            res.status(500).send(e)
        }
    })
    .put('/', ensureAuthenticated, async (req, res) => {
        const { id, created, ...review } = req.body

        console.log(id, review)
        try {
            const vendor = await knex('vendors')
                .first()
                .where('id', req.body.vendorId)
            const [newReview] = await knex('reviews')
                .returning([
                    'id',
                    'vendor_id',
                    'user_id',
                    'comment',
                    'question_1',
                    'question_2',
                    'question_3',
                    'question_4',
                    'question_5',
                    'question_6',
                    'question_7',
                    'question_8',
                    'created',
                    'updated',
                ])
                .update(toDB({ ...review, updated: moment() }))
                .where({ id, user_id: req.user.id })
            newReview.name = vendor.name
            res.status(200).send(fromDB(newReview))
        } catch (e) {
            console.log(e)
            res.status(500).send(e)
        }
    })
    .delete('/', ensureAuthenticated, async (req, res: Response) => {
        try {
            const count = await knex('reviews')
                .where({ id: req.query.id, user_id: req.user.id })
                .delete()
            res.status(200).send(`${count} rows deleted`)
        } catch (e) {
            res.status(500).send(e)
        }
    })
    .get('/', async (req, res) => {
        try {
            const vendors = await knex('vendors_with_reviews')
            res.json(fromDB(vendors))
        } catch (e) {
            console.log(e)
            res.status(500).send(e)
        }
    })
export default router
