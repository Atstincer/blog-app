const router = require('express').Router()

const { Blog } = require('../models')

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll()
  //console.log(blogs)
  res.json(blogs)
})

router.post('/', async (req, res) => {
  console.log('req.body', req.body)
  try {
    const blog = await Blog.create({ ...req.body })
    return res.json(blog)
  } catch (error) {
    return res.status(400).json({ error })
  }
})

router.delete('/:id', async (req, res) => {
  console.log('blogs id to  delete', req.params.id)
  const blog = await Blog.findByPk(req.params.id)
  if (!blog) {
    return res.status(404).json({ error: 'Resource not found' })
  }
  await blog.destroy()
  return res.status(200).json({ message: 'Resource deleted' })
})

module.exports = router
