const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

// Force production mode on cPanel
const dev = false
const port = process.env.PORT || 3000

// Explicitly pass dir so Next.js always finds the .next build directory
const app = next({ dev, dir: __dirname })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error handling request:', err)
      res.statusCode = 500
      res.end('Internal Server Error')
    }
  })

  // Phusion Passenger passes process.env.PORT as 'passenger' or socket
  server.listen(port, (err) => {
    if (err) throw err
    console.log(`> Next.js production server ready on ${port}`)
  })
}).catch((err) => {
  console.error('Failed to prepare Next.js app:', err)
  process.exit(1)
})
