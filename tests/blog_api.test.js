const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const { initialBlogs, blogsInDb } = require('./test_helper')

describe('When there are initially some blogs saved', () => {
  
  beforeAll(async () => {
    await Blog.remove({})
  
    const blogObjects = initialBlogs.map(blog => new Blog(blog))
    await Promise.all(blogObjects.map(blog => blog.save()))
  })

  test('blogs are returned as json by GET /api/blogs', async () => {
    const blogsInDataBase = await blogsInDb()
    
    const res = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  
    expect(res.body.length).toBe(blogsInDataBase.length)
    const returnedTitles = res.body.map(blog => blog.title)
    blogsInDataBase.forEach(blog => {
      expect(returnedTitles).toContain(blog.title)
    })
  })
})

describe('addition of a new blog', () => {

  test('POST /api/blogs succeeds with valid data', async () => {
    const newBlog = {
      title: 'testi4',
      author: 'testaaja3',
      url: 'www.4.com',
      likes: 0
    }

    const blogsAtStart = await blogsInDb()

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    
    const blogsAfterOperation = await blogsInDb()

    expect(blogsAfterOperation.length).toBe(blogsAtStart.length +1)

    const contents = blogsAfterOperation.map(r => r.title)
    expect(contents).toContain('testi4')
  })

  test('POST /api/blogs succeeds with likes not set and sets it to 0', async () => {
    const incompleteBlog = {
      title: 'testi4',
      author: 'testaaja3',
      url: 'www.4.com'
    }

    const blogsAtStart = await blogsInDb()

    await api
      .post('/api/blogs')
      .send(incompleteBlog)
      .expect(201)

    const blogsAfterOperation = await blogsInDb()

    expect(blogsAfterOperation.length).toBe(blogsAtStart.length +1)
    const addedBlog = blogsAfterOperation.find(blog => blog.title === 'testi4')
    expect(addedBlog.likes).toBe(0)
  })

  test('POST /api/blogs fails with proper statuscode if title is missing', async () => {
    const incompleteBlog = {
      author: "testaaja1",
      url: 'www.4.com',
      likes: 0
    }

    const blogsAtStart = await blogsInDb()

    await api
      .post('/api/blogs')
      .send(incompleteBlog)
      .expect(400)

    const blogsAfterOperation = await blogsInDb()

    expect(blogsAfterOperation.length).toBe(blogsAtStart.length)  
  })

  test('POST /api/blogs fails with proper statuscode if url is missing', async () => {
    const incompleteBlog = {
      title: "testi4",
      author: "testaaja1",
      likes: 0
    }

    const blogsAtStart = await blogsInDb()

    await api
      .post('/api/blogs')
      .send(incompleteBlog)
      .expect(400)

    const blogsAfterOperation = await blogsInDb()

    expect(blogsAfterOperation.length).toBe(blogsAtStart.length)  
  })
})

afterAll(() => {
  server.close()
})