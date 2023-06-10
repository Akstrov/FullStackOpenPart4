const dummy = (blogs) => {
  // ...
  return 1;
};
const totalLikes = (blogs) => {
  // ...
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};
const favoriteBlog = (blogs) => {
  // ...
  if (blogs.length === 0) return null;
  let favoriteBlog = blogs.reduce((max, blog) =>
    max.likes > blog.likes ? max : blog
  );
  return Object.keys(favoriteBlog).reduce((obj, key) => {
    if (key !== '_id' && key !== '__v' && key !== 'url')
      obj[key] = favoriteBlog[key];
    return obj;
  }, {});
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null;
  let authors = blogs.reduce((authors, blog) => {
    authors[blog.author] = authors[blog.author] ? authors[blog.author] + 1 : 1;
    return authors;
  }, {});
  let max = 0;
  let author = '';
  for (let key in authors) {
    if (authors[key] > max) {
      max = authors[key];
      author = key;
    }
  }
  return { author: author, blogs: max };
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null;
  let authors = blogs.reduce((authors, blog) => {
    authors[blog.author] = authors[blog.author]
      ? authors[blog.author] + blog.likes
      : blog.likes;
    return authors;
  }, {});
  let max = 0;
  let author = '';
  for (let key in authors) {
    if (authors[key] > max) {
      max = authors[key];
      author = key;
    }
  }
  return { author: author, likes: max };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
