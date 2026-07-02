const AdminOverview = ({ tables, reservations }) => {
  // Calculate Stats
  const totalTables = tables.length;
  
  // A table is reserved if there is a reservation overlapping currently.
  // Since time slots are fixed, we'll just check if it has any bookings for today's current active slot.
  // To keep it simple per requirements, we can just say "reserved tables" for today vs available tables.
  const todayDateString = new Date().toISOString().split('T')[0];
  const todaysReservations = reservations.filter(r => new Date(r.date).toISOString().split('T')[0] === todayDateString && r.status === 'booked');
  
  // Distinct tables reserved today
  const reservedTablesCount = new Set(todaysReservations.map(r => r.tableId?._id)).size;
  const availableTablesCount = totalTables - reservedTablesCount;

  const totalReservations = reservations.length;
  
  // Recent reservations (e.g., top 5)
  const recentReservations = [...reservations].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      <div>
        <h2 className="serif-heading" style={{ fontSize: '1.875rem', marginBottom: '0.5rem' }}>Dashboard Overview</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Real-time metrics and recent activity</p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        <div className="glass-card">
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Total Tables</h3>
          <p className="serif-heading" style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--text-primary)' }}>{totalTables}</p>
        </div>
        <div className="glass-card">
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Available (Today)</h3>
          <p className="serif-heading" style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--success)' }}>{availableTablesCount}</p>
        </div>
        <div className="glass-card">
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Reserved (Today)</h3>
          <p className="serif-heading" style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--accent-gold)' }}>{reservedTablesCount}</p>
        </div>
        <div className="glass-card">
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Total Reservations</h3>
          <p className="serif-heading" style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--text-primary)' }}>{totalReservations}</p>
        </div>
        <div className="glass-card">
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Today's Bookings</h3>
          <p className="serif-heading" style={{ fontSize: '2.5rem', fontWeight: '700', color: '#3b82f6' }}>{todaysReservations.length}</p>
        </div>
      </div>

      <section>
        <h3 className="serif-heading" style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Recent Reservations</h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="modern-table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Guests</th>
                <th>Date</th>
                <th>Time Slot</th>
                <th>Table</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentReservations.map(res => (
                <tr key={res._id}>
                  <td>{res.userId?.name || 'Unknown'}</td>
                  <td>{res.guests}</td>
                  <td>{new Date(res.date).toLocaleDateString()}</td>
                  <td>{res.timeSlot}</td>
                  <td>{res.tableId ? `Table ${res.tableId.tableNumber}` : 'N/A'}</td>
                  <td>
                    <span className={`badge ${res.status === 'booked' ? 'badge-success' : 'badge-danger'}`}>
                      {res.status}
                    </span>
                  </td>
                </tr>
              ))}
              {recentReservations.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No recent reservations.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminOverview;
