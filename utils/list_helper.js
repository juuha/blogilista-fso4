const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item
  }

  return blogs.map(blog => blog.likes).reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  var best = blogs[0]

  blogs.map(blog => {
    if (blog.likes > best.likes) {
      best = blog
    }
  })

  return best
}

var mostBlogs = (blogs) => {
  var bloggers = new Map()

  blogs.map(blog => {
    if (bloggers.has(blog.author)) {
      bloggers.set(blog.author, bloggers.get(blog.author)+1)
    } else {
      bloggers.set(blog.author, 1)
    }
  })

  var most = {
    'blogs': 0
  }

  bloggers.forEach( (blogs, author) => {
    if (blogs > most.blogs) {
      most.author = author
      most.blogs = blogs
    }
  })

  return most.blogs === 0 ? undefined : most
}

const mostLikes = (blogs) => {
  var bloggers = new Map()

  blogs.map(blog => {
    if (bloggers.has(blog.author)) {
      bloggers.set(blog.author, bloggers.get(blog.author)+blog.likes)
    } else {
      bloggers.set(blog.author, blog.likes)
    }
  })

  var most = {
    'likes': 0
  }

  bloggers.forEach( (likes, author) => {
    if (likes >= most.likes) {
      most.author = author,
      most.likes = likes
    }
  })

  return blogs.length !== 0 ? most : undefined
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}