var express = require('express')
var router = express.Router()
var passport = require('passport')
import { knex } from '../../server'
import { fromDB } from '../../utils'

router.post('/', passport.authenticate('local'), async (req, res) => {
    const reviews = await knex('reviews')
        .join('vendors', 'reviews.vendor_id', 'vendors.id')
        .select(
            'reviews.id',
            'reviews.vendor_id',
            'reviews.user_id',
            'reviews.comment',
            'reviews.question_1',
            'reviews.question_2',
            'reviews.question_3',
            'reviews.question_4',
            'reviews.question_5',
            'reviews.question_6',
            'reviews.question_7',
            'reviews.question_8',
            'reviews.created',
            'reviews.updated',
            'vendors.name'
        )
        .where({ user_id: req.user.id })
    req.user.reviews = fromDB(reviews)
    res.json(req.user)
})

// knex('users')
//   .join('contacts', 'users.id', 'contacts.user_id')
//   .select('users.id', 'contacts.phone')
export default router
