const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
import { knex } from '../../server'
const sgMail = require('@sendgrid/mail')
import { SALT_WORK_FACTOR } from '../registration/registration'

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

router.post('/', async (req, res) => {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR)
    const hash = await bcrypt.hash(req.body.password, salt)
    await knex('users')
        .update({ password: hash })
        .where('id', req.user.id)

    const msg = {
        from: {
            email: 'help@bitbyte.com',
        },
        personalizations: [
            {
                to: [
                    {
                        email: req.user.email,
                    },
                ],
                dynamic_template_data: {
                    firstName: req.user.firstName,
                },
            },
        ],
        template_id: 'd-2601520d230b4ca786c4ed36b2b3c651',
    }

    try {
        await sgMail.send(msg)
        res.status(200).send('password successfully changed')
    } catch (e) {
        res.json({ message: 'error sending email' })
    }
})
export default router
