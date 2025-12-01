export default function WalletInfo({ user }) {
  return (
    <div className="info-card">
      <h2>💰 Кошельки</h2>
      
      {user?.wallet && (
        <div className="info-item">
          <div className="info-label">Основной адрес</div>
          <div className="info-value">{user.wallet.address}</div>
          {user.wallet.walletClient && (
            <>
              <div className="info-label" style={{ marginTop: '5px' }}>Тип</div>
              <div className="info-value">{user.wallet.walletClient}</div>
            </>
          )}
        </div>
      )}

      {user?.linkedAccounts?.filter(acc => acc.type === 'wallet').map((wallet, idx) => (
        <div key={idx} className="info-item" style={{ marginTop: '10px' }}>
          <div className="info-label">Кошелек {idx + 1}</div>
          <div className="info-value">{wallet.address}</div>
        </div>
      ))}

      {!user?.wallet && !user?.linkedAccounts?.some(acc => acc.type === 'wallet') && (
        <p style={{ color: '#666' }}>Нет подключенных кошельков</p>
      )}
    </div>
  )
}
