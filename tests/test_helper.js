const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'testi1',
    author: 'testaaja1',
    url: 'www.1.com',
    likes: 10
  },
  {
    title: 'testi2',
    author: 'testaaja1',
    url: 'www.2.com',
    likes: 5
  },
  {
    title: 'testi3',
    author: 'testaaja2',
    url: 'www.3.com',
    likes: 8
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs
}

module.exports = {
  initialBlogs, blogsInDb
}