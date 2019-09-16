module.exports = {
    local: {
        passReqToCallback: true,

        //this needs to be whatever property the client is
        //sending the username in as under req.body
        usernameField: 'email',
    },
}
