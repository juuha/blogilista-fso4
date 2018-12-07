const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { _id: 1, username: 1, name: 1 })

  response.json(blogs.map(Blog.format))
})

blogsRouter.post('/', async (request, response) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid or missing' })
    }

    const body = request.body
    const user = await User.findById(decodedToken.id)

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: user._id
    })

    if (blog.title === undefined || blog.url === undefined) {
      return response.status(400).json({ error: 'title or url missing' })
    }

    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog)
    await user.save()

    response.status(201).json(savedBlog)
  } catch (exception) {
    if (exception.name === 'JsonWebTokenError'){
      return response.status(401).json({ error: exception.message })
    }
    console.log(exception)
    response.status(500).json({ error: 'Something went wrong.' })
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid or missing' })
    }

    const blog = await Blog.findById(request.params.id)

    if (blog.user.toString() !== decodedToken.id.toString()){
      return response.status(401).json({ error: 'Only the poster of the blog can delete it.' })
    }

    await blog.delete()

    response.status(204).end()
  } catch (exception) {
    if (exception.name === 'JsonWebTokenError'){
      return response.status(401).json({ error: exception.message })
    }
    console.log(exception)
    response.status(400).send({ error: 'malformatted id' })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  if (blog.title === undefined || blog.url === undefined) {
    return response.status(400).json({ error: 'title or url missing' })
  }

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0
  }

  try {
    await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })

    response.status(200).end()
  } catch (exception) {
    console.log(exception)
    response.status(400).send({ error: 'malformatted id' })
  }
})

module.exports = blogsRouter