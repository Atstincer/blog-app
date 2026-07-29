const router = require('express').Router()
const { Blog, User } = require('../models')

router.post('/api/reset', async (req, res) => {
  await Blog.destroy()
  await User.destroy()
  return res.status(204).end()
})

router.get('/', async (req, res) => {
  return res.status(200).end()
})

module.exports = router
