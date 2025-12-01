export default function TokenDisplay({ accessToken, identityToken, tokenError, onRefresh }) {
  const copyToClipboard = (token, tokenType) => {
    if (token) {
      navigator.clipboard.writeText(token)
      alert(`${tokenType} скопирован в буфер обмена!`)
    }
  }

  return (
    <>
      <div className="info-card">
        <h2>🔑 Access Token</h2>
        
        {tokenError && (
          <div className="error-message">
            <strong>Ошибка: </strong>{tokenError}
          </div>
        )}

        {accessToken ? (
          <div className="info-item">
            <div className="info-label">JWT Token</div>
            <div className="info-value token-display">{accessToken}</div>
            <div style={{ marginTop: '10px' }}>
              <button className="btn btn-refresh" onClick={() => copyToClipboard(accessToken, 'Access Token')}>
                📋 Копировать
              </button>
              <button className="btn btn-refresh" onClick={onRefresh} style={{ marginLeft: '10px' }}>
                🔄 Обновить
              </button>
            </div>
          </div>
        ) : (
          <div className="loading">Получение токена...</div>
        )}
      </div>

      <div className="info-card">
        <h2>🆔 Identity Token</h2>
        
        {identityToken ? (
          <div className="info-item">
            <div className="info-label">JWT Token</div>
            <div className="info-value token-display">{identityToken}</div>
            <div style={{ marginTop: '10px' }}>
              <button className="btn btn-refresh" onClick={() => copyToClipboard(identityToken, 'Identity Token')}>
                📋 Копировать
              </button>
            </div>
          </div>
        ) : (
          <div className="loading">Получение identity токена...</div>
        )}
      </div>
    </>
  )
}
