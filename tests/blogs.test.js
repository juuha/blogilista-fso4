const listHelper = require('../utils/list_helper')

const blogs = [
  {
    _id: '1', title: 'a', author: 'a', url: 'a.com', likes: 1
  },
  {
    _id: '2', title: 'e1', author: 'e', url: 'b.com', likes: 2
  },
  {
    _id: '5', title: 'e', author: 'e', url: 'e.com', likes: 5
  },
  {
    _id: '3', title: 'c', author: 'c', url: 'c.com', likes: 3
  },
  {
    _id: '4', title: 'd', author: 'd', url: 'd.com', likes: 4
  }
]

const bestBlog = {
  _id: '5', title: 'e', author: 'e', url: 'e.com', likes: 5
}

describe('total likes', () => {

  test('of empty list is zero', () => {
    const blogs = []

    expect(listHelper.totalLikes(blogs)).toBe(0)
  })

  test('of a bigger list is calculated right', () => {
    
    expect(listHelper.totalLikes(blogs)).toBe(15)
  })
})

describe('favorite blog', () => {

  test('of empty list is undefined', () => {
    expect(listHelper.favoriteBlog([])).toBeUndefined()
  })

  test('of filled list is right', () => {
    expect(listHelper.favoriteBlog(blogs)).toEqual(bestBlog)
  })
})

describe('Author with most blogs', () => {

  test('of empty list is undefined', () => {
    expect(listHelper.mostBlogs([])).toBeUndefined()
  })

  test('of filled list is right', () => {
    expect(listHelper.mostBlogs(blogs)).toEqual({
      author: 'e',
      blogs: 2
    })
  })
})

describe('Author with most likes', () => {

  test('of empty list is undefined', () => {
    expect(listHelper.mostLikes([])).toBeUndefined()
  })

  test('of filled list is right', () => {
    expect(listHelper.mostLikes(blogs)).toEqual({
      author: 'e',
      likes: 7
    })
  })
})