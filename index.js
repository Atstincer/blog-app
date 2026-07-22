require('dotenv').config()
const { Sequelize, Model, DataTypes } = require('sequelize')
const express = require('express')

const app = express()

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
})

class Blog extends Model {}
Blog.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  author: {
    type: DataTypes.TEXT
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'blog'
})

app.use(express.json())

app.get('/api/blogs', async (req, res) => {
  const blogs = await Blog.findAll()  
  //console.log(blogs)
  res.json(blogs)
})

app.post('/api/blogs', async (req, res) => {
  console.log('req.body', req.body)
  try{
    const blog = await Blog.create({...req.body})
    return res.json(blog)
  } catch(error){
    return res.status(400).json({error})
  }
})

app.delete('/api/blogs/:id', async (req, res) => {
  console.log('blogs id to  delete', req.params.id)
  const blog = await Blog.findByPk(req.params.id)
  if(!blog){
    return res.status(404).json({error:'Resource not found'})
  }
  await blog.destroy()
  return res.status(200).json({message: 'Resource deleted'})
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
