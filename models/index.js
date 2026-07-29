const Blog = require('./blog')
const User = require('./user')
const { sequelize } = require('../util/db')

User.hasMany(Blog)
Blog.belongsTo(User)

//User.sync({ alter: true })
//Blog.sync({ alter: true })

sequelize.sync({ alter: true })

module.exports = {
  Blog,
  User,
}
