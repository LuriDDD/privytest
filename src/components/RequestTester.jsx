import { useState, useEffect } from 'react'
import { usePrivy } from '@privy-io/react-auth'
import './RequestTester.css'

export default function RequestTester() {
  const { user, getAccessToken } = usePrivy()
  const [url, setUrl] = useState('https://testyumi.work.gd/api/test')
  const [method, setMethod] = useState('GET')
  const [headers, setHeaders] = useState('Content-Type: application/json')
  const [body, setBody] = useState('')
  const [response, setResponse] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [useAuthToken, setUseAuthToken] = useState(true)
  const [authToken, setAuthToken] = useState(null)

  // Получаем токен при монтировании если пользователь залогирован
  useEffect(() => {
    if (user && useAuthToken) {
      fetchToken()
    }
  }, [user])

  const fetchToken = async () => {
    try {
      const token = await getAccessToken()
      setAuthToken(token)
    } catch (err) {
      console.error('Error getting token:', err)
    }
  }

  const makeRequest = async () => {
    try {
      setLoading(true)
      setError(null)
      setResponse(null)

      const options = {
        method: method,
        headers: {},
        credentials: 'include' // Отправлять куки если они есть
      }

      // Парсим заголовки
      if (headers) {
        headers.split('\n').forEach(line => {
          const [key, value] = line.split(':').map(s => s.trim())
          if (key && value) {
            options.headers[key] = value
          }
        })
      }

      // Добавляем Authorization токен если включено
      if (useAuthToken && authToken) {
        options.headers['Authorization'] = `Bearer ${authToken}`
      }

      // Добавляем тело если нужно
      if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        options.body = body
      }

      console.log('Making request:', { url, options: { ...options, headers: options.headers } })

      const res = await fetch(url, options)
      const data = await res.text()

      setResponse({
        status: res.status,
        statusText: res.statusText,
        headers: Object.fromEntries(res.headers),
        body: data
      })

      console.log('Response:', { status: res.status, data })
    } catch (err) {
      console.error('Error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="request-tester">
      <h2>🔧 Request Tester</h2>
      <p style={{ color: '#666', marginBottom: '15px' }}>Сделай запрос к любому домену и посмотри его в Network</p>

      <div className="form-group">
        <label>URL</label>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://testyumi.work.gd"
          className="input-field"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Method</label>
          <select value={method} onChange={(e) => setMethod(e.target.value)} className="input-field">
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="PATCH">PATCH</option>
            <option value="DELETE">DELETE</option>
            <option value="HEAD">HEAD</option>
          </select>
        </div>
      </div>

      {user && (
        <div className="form-group" style={{ background: '#f0f9ff', padding: '15px', borderRadius: '6px', border: '1px solid #93c5fd' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="checkbox"
              checked={useAuthToken}
              onChange={(e) => setUseAuthToken(e.target.checked)}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <span>📌 Использовать Privy Access Token</span>
          </label>
          {authToken && (
            <div style={{ marginTop: '10px', fontSize: '0.85rem', color: '#1e40af' }}>
              ✅ Токен загружен и будет отправлен в Authorization заголовке
            </div>
          )}
          {!authToken && useAuthToken && (
            <div style={{ marginTop: '10px', fontSize: '0.85rem', color: '#dc2626' }}>
              ⚠️ Токен не загружен. Залогинься сначала!
            </div>
          )}
        </div>
      )}

      <div className="form-group">
        <label>Headers (key: value, по одному на строку)</label>
        <textarea
          value={headers}
          onChange={(e) => setHeaders(e.target.value)}
          className="input-field"
          rows="4"
          placeholder="Content-Type: application/json&#10;X-Custom-Header: value"
        />
      </div>

      {(method === 'POST' || method === 'PUT' || method === 'PATCH') && (
        <div className="form-group">
          <label>Body (JSON)</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="input-field"
            rows="4"
            placeholder='{"key": "value"}'
          />
        </div>
      )}

      <button className="btn btn-primary" onClick={makeRequest} disabled={loading}>
        {loading ? '⏳ Отправляю...' : '🚀 Отправить запрос'}
      </button>

      {error && (
        <div className="error-box">
          <strong>Ошибка:</strong> {error}
        </div>
      )}

      {response && (
        <div className="response-box">
          <h3>📨 Ответ</h3>
          
          <div className="response-item">
            <div className="response-label">Статус</div>
            <div className="response-value">
              {response.status} {response.statusText}
            </div>
          </div>

          <div className="response-item">
            <div className="response-label">Заголовки</div>
            <div className="response-value response-json">
              {JSON.stringify(response.headers, null, 2)}
            </div>
          </div>

          <div className="response-item">
            <div className="response-label">Body</div>
            <div className="response-value response-json">
              {response.body}
            </div>
          </div>
        </div>
      )}

      <div className="info-box">
        <p>💡 <strong>Совет:</strong> Открой DevTools (F12) → Network чтобы увидеть запросы</p>
      </div>
    </div>
  )
}
