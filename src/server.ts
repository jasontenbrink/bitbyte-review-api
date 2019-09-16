require('dotenv').config()
import * as express from 'express'
import { Request, Response, Application } from 'express-serve-static-core'
import * as path from 'path'
import * as bodyParser from 'body-parser'
// import * as session from 'express-session'
const session = require('express-session')
import passport from './strategies/index'
import registration from './routes/registration/index'
import login from './routes/login/index'
import reviews from './routes/reviews/index'
import vendors from './routes/vendors/index'
import feedback from './routes/feedback/index'
import suggestedVendors from './routes/suggested-vendors/index'
import forgotPassword from './routes/forgot-password/index'

export const knex = require('knex')('postgres://localhost:5432/bitbyte')

const app: Application = express()
app.set('port', process.env.PORT || 5000)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const paths = path.join(__dirname, '../build')
app.use(express.static(paths))

app.use(
    session({
        secret: 'process.env.SECRET',
        key: 'user', //this is the name of the key that will be attached to req.session or maybe req.user, can't remember
        resave: 'true',
        saveUninitialized: false,
        cookie: { maxage: 600000, secure: false },
    })
)

app.use(passport.initialize())
app.use(passport.session())

app.use('/api/registration', registration)
app.use('/api/login', login)
app.use('/api/reviews', reviews)
app.use('/api/vendors', vendors)
app.use('/api/suggested-vendors', suggestedVendors)
app.use('/api/feedback', feedback)
app.use('/api/forgot-password', forgotPassword)

app.get('/*', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../build/index.html'))
})

app.listen(app.get('port'), () =>
    console.log(`server running on port ${app.get('port')}`)
)
