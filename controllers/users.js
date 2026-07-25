const router = require('express').Router()
const bcrypt = require('bcrypt')
const { User } = require('../models')

//gets all users
router.get('/', async (req, res) => {
  const users = await User.findAll()
  res.json(users)
})

//adds a new user
router.post('/', async (req, res, next) => {
  try {
    console.log(req.body)
    const { username, name, password } = req.body
    const saltRounds = 10
    const passwordhash = await bcrypt.hash(password, saltRounds)
    const newUser = await User.create({ username, name, passwordhash })
    res.json({ name: newUser.name, username: newUser.username })
  } catch (error) {
    //console.log(error)
    next(error)
  }
})

//changes user's name
router.put('/:username', async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { username: req.params.username },
    })
    if (user) {
      user.name = req.body.name
      await user.save()
      return res.json(user)
    } else {
      res.status(404).end()
    }
  } catch (error) {
    //console.log(error)
    next(error)
  }
})

module.exports = router
