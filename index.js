const express = require('express')
const app = express()

const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')

const blogRouter = require('./controllers/blogs')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const authorRouter = require('./controllers/authors')
const utilRouter = require('./controllers/util')

app.use(express.json())

app.use('/api/blogs', blogRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)
app.use('/api/authors', authorRouter)
app.use('/', utilRouter)

const errorHandler = (error, request, response, next) => {
  console.error(error)
  //console.log('error.name', error.name)
  if (error.name === 'SequelizeValidationError') {
    return response.status(400).send({ error: error.message })
  }
  return response.status(500).json({
    error: error.message,
    name: error.name,
  })
}

app.use(errorHandler)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()
