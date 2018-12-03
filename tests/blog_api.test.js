const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
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

const newBlog = {
  title: 'testi4',
  author: 'testaaja3',
  url: 'www.4.com',
  likes: 0
}

beforeAll(async () => {
  await Blog.remove({})

  const blogObjects = initialBlogs.map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

describe('On HTTP GET request', () => {
  
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  
  test('all blogs are returned', async () => {
    const res = await api
      .get('/api/blogs')
  
    expect(res.body.length).toBe(initialBlogs.length)
  })
  
  test('a specific blog is within the returned blogs', async () => {
    const res = await api
      .get('/api/blogs')
  
    const contents = res.body.map(r => r.title)
  
    expect(contents).toContain('testi3')
  })

})

describe('On HTTP POST request', () => {

  test('a valid blog can be added', async () => {
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    
    const res = await api
      .get('/api/blogs')

    const contents = res.body.map(r => r.title)
    expect(res.body.length).toBe(initialBlogs.length +1)
    expect(contents).toContain('testi4')
  })

  test('a blog without likes has 0 likes', async () => {
    const incompleteBlog = {
      title: 'testi4',
      author: 'testaaja3',
      url: 'www.4.com'
    }

    await api
      .post('/api/blogs')
      .send(incompleteBlog)
      .expect( res => {
        res.body._id = 1 // removes id randomization
      })
      .expect(201, {
        _id: 1,
        title: "testi4",
        author: 'testaaja3',
        url: 'www.4.com',
        likes: 0, // This row checks that likes === 0
        __v: 0
      })
  })

  test('a blog without a title is not added', async () => {
    const incompleteBlog = {
      author: "testaaja1",
      url: 'www.4.com',
      likes: 0
    }
    
    const initialBlogs = await api
      .get('/api/blogs')

    await api
      .post('/api/blogs')
      .send(incompleteBlog)
      .expect(400)

    const response = await api
      .get('/api/blogs')

    expect(response.body.length).toBe(initialBlogs.body.length)  
  })

  test('a blog without an url is not added', async () => {
    const incompleteBlog = {
      title: "testi4",
      author: "testaaja1",
      likes: 0
    }
    
    const initialBlogs = await api
      .get('/api/blogs')

    await api
      .post('/api/blogs')
      .send(incompleteBlog)
      .expect(400)

    const response = await api
      .get('/api/blogs')

    expect(response.body.length).toBe(initialBlogs.body.length)  
  })
})

afterAll(() => {
  server.close()
})