const { Op } = require('sequelize')
const router = require('express').Router()
const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')

const { Blog, User } = require('../models')

//gets all blogs
router.get('/', async (req, res) => {
  const where = {}
  if (req.query.search) {
    where.title = {
      [Op.iLike]: `%${req.query.search}%`,
    } //Op.iLike for case insensitive and `%value%` for substring behavior
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name'],
    },
    where,
  })
  //console.log(blogs)
  res.json(blogs)
})

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch {
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

//creates a new blog asociated with the logged in user
router.post('/', tokenExtractor, async (req, res, next) => {
  //console.log('req.body', req.body)
  try {
    const user = await User.findByPk(req.decodedToken.id)
    const blog = await Blog.create({ ...req.body, userId: user.id })
    return res.json(blog)
  } catch (error) {
    //return res.status(400).json({ error })
    next(error)
  }
})

//blog finder middlerware
const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  if (!req.blog) {
    return res.status(404).end()
  }
  next()
}

//deletes a blog
router.delete('/:id', tokenExtractor, blogFinder, async (req, res) => {
  if (req.decodedToken.id !== req.blog.userId) {
    return res.status(403).json({ message: 'Unauthorized user' })
  }
  await req.blog.destroy()
  return res.status(200).json({ message: 'Resource deleted' })
})

//changes the likes of a blog
router.put('/:id', blogFinder, async (req, res, next) => {
  console.log('req.blog', req.blog.toJSON())
  try {
    req.blog.likes = req.body.likes
    await req.blog.save()
    return res.json(req.blog)
  } catch (error) {
    //console.log('catching the error')
    next(error)
  }
})

module.exports = router
