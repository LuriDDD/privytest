export default function UserInfo({ user }) {
  return (
    <div className="info-card">
      <h2>👤 Основная информация</h2>
      
      {user?.email && (
        <div className="info-item">
          <div className="info-label">Email</div>
          <div className="info-value">{user.email.address}</div>
        </div>
      )}

      {user?.phone && (
        <div className="info-item">
          <div className="info-label">Телефон</div>
          <div className="info-value">{user.phone.number}</div>
        </div>
      )}

      <div className="info-item">
        <div className="info-label">User ID</div>
        <div className="info-value">{user?.id || 'N/A'}</div>
      </div>

      {user?.createdAt && (
        <div className="info-item">
          <div className="info-label">Создан</div>
          <div className="info-value">
            {new Date(user.createdAt).toLocaleString('ru-RU')}
          </div>
        </div>
      )}
    </div>
  )
}
