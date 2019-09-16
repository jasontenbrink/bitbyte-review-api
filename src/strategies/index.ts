const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const config = require('./config')
const localStrategy = require('./local')

passport.serializeUser(function(userFromStrategy, done) {
    console.log('serializer')
    done(null, userFromStrategy)
})

passport.deserializeUser((userFromSerializer, done) => {
    console.log('deserializer', userFromSerializer)
    done(null, userFromSerializer)
})

passport.use('local', new LocalStrategy(config.local, localStrategy))

export default passport
