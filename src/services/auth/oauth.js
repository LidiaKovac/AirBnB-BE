const passport = require("passport")
const GoogleStrategy = require('passport-google-oauth20').Strategy
const { User } = require("../utils/db")
const { authentication } = require("./tools.js")

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: process.env.REDIRECT_URL,
    },
    async (request, accessToken, refreshToken, profile, next) => {
      
      const newUser = { //builds new user
        googleId: profile.id,
        name: profile.name.givenName,
        last_name: profile.name.familyName,
        email: profile.emails[0].value,
        role: "basic",
        refreshTokens: [],
      }
      console.log(profile.id)
      try {
        const userDATA = await User.findAll({where: { //find all with google id equal to the one generated
            googleId: profile.id
        }})
        
        if (userDATA.length>0) { //if the user is found
            const user = userDATA[0].dataValues
            
          const tokens = await authentication(user) //authenticate it 
          next(null, { user, tokens })
        } else { //else create a new user
          const createdUser = await User.create(newUser)
          const tokens = await authentication(createdUser)
          next(null, { user: createdUser, tokens })
        }
      } catch (error) {
        next(error)
      }
    }
  )
)

passport.serializeUser(function (user, next) {
  next(null, user)
})