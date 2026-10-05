import { TextField, Button } from '@mui/material'
const LoginForm = ({
  handleSubmit,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password
}) => {
  return (
    <div>
      <h2>Log in to application</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <TextField variant="standard"
            label="username"
            type="text"
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div>
          <TextField style={{ marginTop: 10, borderTop: 'none' }}
            variant="standard"
            label="password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <div>
          <Button type="submit" variant="contained" style={{ marginTop: 10 }}>
                        login
          </Button>
        </div>

      </form>
    </div>
  )
}

export default LoginForm