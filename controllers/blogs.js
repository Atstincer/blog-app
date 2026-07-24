const router = require('express').Router()

const { Blog } = require('../models')

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll()
  //console.log(blogs)
  res.json(blogs)
})

router.post('/', async (req, res, next) => {
  //console.log('req.body', req.body)
  try {
    const blog = await Blog.create({ ...req.body })
    return res.json(blog)
  } catch (error) {
    //return res.status(400).json({ error })
    next(error)
  }
})

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  if (!req.blog) {
    return res.status(404).end()
  }
  next()
}

router.delete('/:id', blogFinder, async (req, res) => {
  await req.blog.destroy()
  return res.status(200).json({ message: 'Resource deleted' })
})

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
