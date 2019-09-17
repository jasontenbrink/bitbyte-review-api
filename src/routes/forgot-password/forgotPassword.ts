const express = require('express')
const router = express.Router()
const generator = require('generate-password')
const bcrypt = require('bcrypt')
import { knex } from '../../server'
const sgMail = require('@sendgrid/mail')
import { SALT_WORK_FACTOR } from '../registration/registration'

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

router.get('/', async (req, res) => {
    let firstName = ''
    try {
        const { email, first_name } = await knex('users')
            .where('email', req.query.email)
            .first('email, first_name')
        if (!email) return res.status(200).send()
        firstName = first_name
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

    const msg1 = {
        from: {
            email: 'help@bitbyte.com',
        },
        personalizations: [
            {
                to: [
                    {
                        email: req.query.email,
                    },
                ],
                dynamic_template_data: {
                    firstName: firstName,
                    appLink: 'bitbyte-reviews.com/login',
                    password,
                },
            },
        ],
        template_id: 'd-2e48453fde6d4664a5ddb22d5f809aba',
    }

    try {
        await sgMail.send(msg1)
        res.status(200).send()
    } catch (e) {
        res.json({ message: 'error sending email' })
    }
})
export default router
