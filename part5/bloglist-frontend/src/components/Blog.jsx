import { Card, CardContent, Typography, Button, Box } from '@mui/material'

const Blog = ({ blog, onLike, deleteBlog, user }) => {

  if(!blog) {
    return null
  }

  const handleDelete = async () => {
    await deleteBlog(blog)
  }

  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          {blog.title}
        </Typography>

        <Typography variant="subtitle1" sx={{ color: 'grey.600' }} gutterBottom>
            by {blog.author}
        </Typography>

        <Typography variant="body2" sx={{ color: 'blue' }} gutterBottom>
          <a href={blog.url} target="_blank" rel="noreferrer">
            {blog.url}
          </a>
        </Typography>

        <Typography variant="body2" sx={{ color: 'grey.600' }} gutterBottom>
            Added by {blog.user?.name}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1 }}>
          <Typography>{blog.likes} likes</Typography>

          {user && (
            <Button sx={{ fontWeight: 'bold' }}
              variant="outlined"
              size="small"
              onClick={() => onLike(blog)}>
                  like
            </Button>
          )}

          {user && blog.user?.username === user.username && (
            <Button sx={{ fontWeight: 'bold' }}
              variant="outlined"
              color="error"
              size="small"
              onClick={handleDelete}
            >
                  remove
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}

export default Blog