const {app, environment} = require('./index')

// Initialize servers
const PORT = process.env.PORT || 3000

// 0.0.0.0 means that the server will always listen to IPv4
const server = app.listen(
  PORT,
  '0.0.0.0', () => {
    const host = server.address().address
    const port = server.address().port
    console.log(`Server running in ${environment} at http://${host}:${port}`)
  }
)

// Handle unhandled promise rejection
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red)
})