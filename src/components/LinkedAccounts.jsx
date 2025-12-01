export default function LinkedAccounts({ user }) {
  const hasLinkedAccounts = user?.google || user?.twitter || user?.discord || user?.github

  return (
    <div className="info-card">
      <h2>🔗 Связанные аккаунты</h2>
      
      {user?.google && (
        <div className="info-item">
          <div className="info-label">Google</div>
          <div className="info-value">
            {user.google.email || user.google.subject || 'Connected'}
          </div>
        </div>
      )}

      {user?.twitter && (
        <div className="info-item">
          <div className="info-label">Twitter</div>
          <div className="info-value">
            {user.twitter.username || user.twitter.subject || 'Connected'}
          </div>
        </div>
      )}

      {user?.discord && (
        <div className="info-item">
          <div className="info-label">Discord</div>
          <div className="info-value">
            {user.discord.username || user.discord.email || 'Connected'}
          </div>
        </div>
      )}

      {user?.github && (
        <div className="info-item">
          <div className="info-label">GitHub</div>
          <div className="info-value">
            {user.github.username || user.github.subject || 'Connected'}
          </div>
        </div>
      )}

      {!hasLinkedAccounts && (
        <p style={{ color: '#666' }}>Нет связанных социальных аккаунтов</p>
      )}
    </div>
  )
}
