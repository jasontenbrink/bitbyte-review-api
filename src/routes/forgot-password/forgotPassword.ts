const express = require('express')
const router = express.Router()
const generator = require('generate-password')
const bcrypt = require('bcrypt')
import { knex } from '../../server'
const sgMail = require('@sendgrid/mail')
import { SALT_WORK_FACTOR } from '../registration/registration'

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

router.get('/', async (req, res) => {
    // look for email. If we have it reset password.  If not skip everything and send back 200.
    try {
        const email = await knex('users')
            .where('email', req.query.email)
            .first('email')
        console.log(email)
        if (!email) return res.status(200).send()
    } catch (e) {
        console.log(e)
        return res.status(500).send()
    }

    const password = generator.generate({
        length: 10,
        numbers: true,
        symbols: false,
        uppercase: true,
        excludeSimilarCharacters: true,
    })
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR)
    const hash = await bcrypt.hash(password, salt)
    await knex('users')
        .update({ password: hash })
        .where('email', req.query.email)

    console.log('hash', hash)
    // if insert actuall happened send email
    const msg = {
        to: 'jason.tenbrink@gmail.com',
        from: 'test@example.com',
        subject: 'Sending with Twilio SendGrid is Fun',
        text: 'and easy to do anywhere, even with Node.js',
        html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    }

    const msg1 = {
        from: {
            email: 'elainearon@gmail.com',
        },
        personalizations: [
            {
                to: [
                    {
                        email: 'jason.tenbrink@gmail.com',
                    },
                ],
                dynamic_template_data: {
                    firstName: 'Jason',
                    appLink: 'bitbyte-reviews.com/login',
                    password,
                },
            },
        ],
        template_id: 'd-2e48453fde6d4664a5ddb22d5f809aba',
    }

    try {
        const response = await sgMail.send(msg1)
        res.send(response)
    } catch (e) {
        res.json(e)
    }
})
export default router
