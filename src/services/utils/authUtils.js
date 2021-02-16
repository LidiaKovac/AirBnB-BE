findByCredentials = async(email, password) => {
    const user = await User.findAll({where: {
      email: email
    }})
  
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password)
      if (isMatch) return user
      else return null
    } else return null
  }
  
    toJSON = (user) => {
    const userObject = user.toObject()
  
    delete userObject.password
    delete userObject.__v
    return userObject
  }
  
//   User.pre("save", async function (next) { CANNOT FIND THE EQUIVALENT FOR POSTGRES! 
//     const user = this
//     if (user.isModified("password")) {
//       user.password = await bcrypt.hash(user.password, 10)
//     }
//     next()
//   })

module.exports = {
    findByCredentials,
    toJSON
}