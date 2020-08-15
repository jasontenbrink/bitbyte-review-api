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
import changePassword from './routes/change-password/index'
import logout from './routes/logout/index'
export const knex = require('knex')(process.env.DATABASE_URL)
export const ensureAuthenticated = (req: any, res, next) =>
    req.isAuthenticated() ? next() : res.status(401).send()

export const mom = { hi: 'mom' }

const app: Application = express()
app.set('port', process.env.PORT || 5000)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const paths = path.join(__dirname, '../build')
app.use(express.static(paths))

app.use(
    session({
        secret: process.env.SECRET,
        key: 'user', //this is the name of the key that will be attached to req.session or maybe req.user, can't remember
        resave: 'true',
        saveUninitialized: false,
        cookie: { maxage: 600000, secure: false },
    })
)

app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next) => {
    console.log('Node env', process.env.NODE_ENV)
    console.log('x-forwarded-proto', req.headers['x-forwarded-proto'])
    if (
        req.headers['x-forwarded-proto'] !== 'https' &&
        process.env.NODE_ENV === 'production'
    ) {
        // return res.redirect(
        //     301,
        //     ['https://', req.get('Host'), req.url].join('')
        // )
    }
    return next()
})
// app.use(
//     cors({
//         credentials: true,
//         origin: '*',
//         methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//         preflightContinue: false,
//         optionsSuccessStatus: 204,
//     })
// )

app.use('/api/registration', registration)
app.use('/api/login', login)
app.use('/api/reviews', reviews)
app.use('/api/logout', logout)
app.use('/api/vendors', ensureAuthenticated, vendors)
app.use('/api/suggest-vendor', suggestedVendors)
app.use('/api/feedback', feedback)
app.use('/api/forgot-password', forgotPassword)
app.use('/api/change-password', ensureAuthenticated, changePassword)

app.get('/*', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../build/index.html'))
})

app.listen(app.get('port'), () =>
    console.log(`server running on port ${app.get('port')}`)
)
