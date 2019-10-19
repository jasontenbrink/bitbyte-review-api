const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const config = require('./config')
const localStrategy = require('./local')

passport.serializeUser(function(userFromStrategy, done) {
    console.log('serializer')
    done(null, userFromStrategy)
})

passport.deserializeUser((userFromSessionStore, done) => {
    console.log('deserializer', userFromSessionStore)
    done(null, userFromSessionStore)
})

passport.use('local', new LocalStrategy(config.local, localStrategy))

export default passport
