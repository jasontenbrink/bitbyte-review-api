import { knex } from '../server'
var bcrypt = require('bcrypt')

module.exports = async (req, username, password, done) => {
    console.log('local')
    const email = req.body.email

    const { rows } = await knex.raw(
        `select id, email, password, first_name, last_name from users where email=?`,
        [email]
    )
    if (rows.length === 0) return done(null, false, 'login unsuccessful')
    const isValid = await bcrypt.compare(req.body.password, rows[0].password)
    if (isValid) {
        return done(null, {
            id: rows[0].id,
            email: rows[0].email,
            firstName: rows[0].first_name,
            lastName: rows[0].last_name,
        })
    } else done(null, false, 'login unsuccessful')

    // pgQuery(
    //     'select password, pin from people where email = $1',
    //     [req.body.username],
    //     function(err, rows) {
    //         if (err) return err
    //         if (rows === undefined || rows[0] == undefined) {
    //             return done(null, false, { message: 'no email found' })
    //         }
    //         var dbPassword = rows[0].password
    //         bcrypt.compare(req.body.password, dbPassword, function(
    //             err,
    //             isMatch
    //         ) {
    //             if (err) return err

    //             //this var gets sent to SerializeUser and is passed in as the
    //             //user parameter. I think SerializeUser is what actually makes
    //             //the session.
    //             var objectSentToSerializer = {
    //                 username: req.body.username,
    //                 randomFunMessage: 'chickenButt',
    //                 pin: rows[0].pin,
    //             }

    //             if (isMatch) {
    //                 return done(null, objectSentToSerializer)
    //             } else {
    //                 console.log('authentication failed')
    //                 return done(null, false, { message: 'failed' })
    //             }
    //         })
    //     }
    // )
}
