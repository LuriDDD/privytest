import { usePrivy, useIdentityToken } from '@privy-io/react-auth'
import { useState, useEffect } from 'react'
import './App.css'
import UserInfo from './components/UserInfo'
import TokenDisplay from './components/TokenDisplay'
import WalletInfo from './components/WalletInfo'
import LinkedAccounts from './components/LinkedAccounts'
import RequestTester from './components/RequestTester'

function App() {
  const { ready, authenticated, user, login, logout, getAccessToken } = usePrivy()
  const { identityToken } = useIdentityToken()
  const [accessToken, setAccessToken] = useState(null)
  const [tokenError, setTokenError] = useState(null)

  useEffect(() => {
    if (authenticated) {
      refreshToken()
    }
  }, [authenticated])

  const refreshToken = async () => {
    try {
      setTokenError(null)
      const token = await getAccessToken()
      setAccessToken(token)
    } catch (error) {
      console.error('Error getting token:', error)
      setTokenError(error.message)
    }
  }

  if (!ready) {
    return (
      <div className="container">
        <div className="loading">Инициализация Privy...</div>
      </div>
    )
  }

  if (!authenticated) {
    return (
      <div className="container">
        <div className="header">
          <h1>🔐 Privy Test Dashboard</h1>
          <p>Тестирование авторизации и получение данных пользователя</p>
        </div>
        
        <div className="login-card">
          <h2>Войдите для тестирования</h2>
          <p>После входа вы увидите всю информацию о пользователе, токены и связанные аккаунты</p>
          <button className="btn btn-primary" onClick={login}>
            🚀 Войти через Privy
          </button>
        </div>

        <RequestTester />
      </div>
    )
  }

  return (
    <div className="container">
      <div className="header">
        <h1>🔐 Privy Test Dashboard</h1>
        <p>Тестирование авторизации и получение данных пользователя</p>
      </div>

      <div className="status-card">
        <div className="status-info">
          <span className="status-badge">✓ Авторизован</span>
          <p className="user-id">User ID: {user?.id || 'N/A'}</p>
        </div>
        <div className="actions">
          <button className="btn btn-refresh" onClick={refreshToken}>
            🔄 Обновить токен
          </button>
          <button className="btn btn-logout" onClick={logout}>
            🚪 Выйти
          </button>
        </div>
      </div>

      <div className="info-grid">
        <UserInfo user={user} />
        <WalletInfo user={user} />
        <LinkedAccounts user={user} />
      </div>

      <TokenDisplay 
        accessToken={accessToken}
        identityToken={identityToken}
        tokenError={tokenError}
        onRefresh={refreshToken}
      />

      <div className="info-card">
        <h2>📦 Полный объект пользователя (JSON)</h2>
        <pre className="json-display">{JSON.stringify(user, null, 2)}</pre>
      </div>

      <RequestTester />
    </div>
  )
}

export default App
