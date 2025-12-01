import express from 'express'
import https from 'https'
import fs from 'fs'
import path from 'path'
import os from 'os'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200)
    return
  }
  next()
})

// Прокси для запросов
app.all('/api/proxy', async (req, res) => {
  try {
    const { url, method = 'GET', headers = {}, body } = req.body

    if (!url) {
      return res.status(400).json({ error: 'URL is required' })
    }

    const options = {
      method: method,
      headers: {
        ...headers,
        'User-Agent': 'Privy-Test-Dashboard/1.0'
      }
    }

    const proxy = new Promise((resolve, reject) => {
      const urlObj = new URL(url)
      const protocol = urlObj.protocol === 'https:' ? https : https
      
      const request = protocol.request(url, options, (response) => {
        let data = ''
        
        response.on('data', (chunk) => {
          data += chunk
        })
        
        response.on('end', () => {
          resolve({
            status: response.statusCode,
            statusText: response.statusMessage,
            headers: response.headers,
            body: data
          })
        })
      })

      request.on('error', reject)

      if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        request.write(typeof body === 'string' ? body : JSON.stringify(body))
      }

      request.end()
    })

    const result = await proxy
    res.json(result)
  } catch (error) {
    console.error('Proxy error:', error)
    res.status(500).json({ error: error.message })
  }
})

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

// SSL certificates
const options = {
  key: fs.readFileSync(path.join(os.homedir(), 'certs/localhost.key')),
  cert: fs.readFileSync(path.join(os.homedir(), 'certs/localhost.crt'))
}

const PORT = 3001

https.createServer(options, app).listen(PORT, () => {
  console.log(`\n🔒 HTTPS Proxy Server running on https://localhost:${PORT}`)
  console.log(`📍 Proxy endpoint: https://localhost:${PORT}/api/proxy`)
  console.log(`✅ Use this for testing cross-origin requests\n`)
})
