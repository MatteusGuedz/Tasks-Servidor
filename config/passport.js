const { authSecret } = require('../.env') //chave
const passport = require('passport')
const passportJwt = require('passport-jwt')
const { Strategy, ExtractJwt} = passportJwt
//estratégia de auth, extrair token do cabeçalho


module.exports = app => {
  const params = {
    secretOrKey: authSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    //token esta vindo como header
  }

  const strategy = new Strategy(params, (payload, done) => {
    app.db('users')
      .where({id: payload.id})
      .first()
      .then(user => {
        if(user){
          done(null, {id: user.id, email: user.emai})
        }else {
          done(null) 
        }
      })
      .catch(err => done(err, false))
  })

  passport.use(strategy)

  return {
    initialize: () => passport.initialize(),
    authenticate: () => passport.authenticate('jwt', {session:false})
  }
}

