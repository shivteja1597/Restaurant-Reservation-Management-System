import { useState } from 'react';

const AdminReservations = ({ reservations, tables, handleCancelReservation, handleUpdateReservation }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [selectedReservation, setSelectedReservation] = useState(null);

  // Filter Logic
  const filteredReservations = reservations.filter(res => {
    const matchesName = res.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = dateFilter ? new Date(res.date).toISOString().split('T')[0] === dateFilter : true;
    const matchesStatus = statusFilter ? res.status === statusFilter : true;
    return matchesName && matchesDate && matchesStatus;
  });

  const handleEditClick = (res) => {
    setSelectedReservation({ ...res });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    handleUpdateReservation(selectedReservation);
    setSelectedReservation(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h2 style={{ fontSize: '1.875rem', marginBottom: '0.5rem' }}>Reservations Management</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Filter and manage bookings</p>
      </div>

      <div className="glass-card" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          className="modern-input"
          style={{ flex: 1, minWidth: '200px' }}
          placeholder="Search by customer name..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <input
          type="date"
          className="modern-input"
          style={{ width: 'auto' }}
          value={dateFilter}
          onChange={e => setDateFilter(e.target.value)}
        />
        <select
          className="modern-input"
          style={{ width: 'auto' }}
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="booked">Booked</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="modern-table">
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Guests</th>
              <th>Date</th>
              <th>Time Slot</th>
              <th>Assigned Table</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReservations.map((res) => (
              <tr key={res._id}>
                <td>{res.userId?.name || 'Unknown'}</td>
                <td>{res.guests}</td>
                <td>{new Date(res.date).toLocaleDateString()}</td>
                <td>{res.timeSlot}</td>
                <td>{res.tableId ? `Table ${res.tableId.tableNumber}` : <span style={{ color: 'var(--text-secondary)' }}>N/A</span>}</td>
                <td>
                  <span className={`badge ${res.status === 'booked' ? 'badge-success' : 'badge-danger'}`}>
                    {res.status}
                  </span>
                </td>
                <td style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn-primary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }} onClick={() => handleEditClick(res)}>View / Edit</button>
                  {res.status === 'booked' && (
                    <button className="btn-danger" style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }} onClick={() => handleCancelReservation(res._id)}>Cancel</button>
                  )}
                </td>
              </tr>
            ))}
            {filteredReservations.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>No reservations match filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {selectedReservation && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(2, 6, 23, 0.8)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 50 }}>
          <div className="glass-panel" style={{ padding: '2rem', width: '100%', maxWidth: '500px', margin: '1rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--accent-gold)' }}>Reservation Details</h3>
            <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--border-light)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Customer Name: </span>
                <span style={{ fontWeight: '600' }}>{selectedReservation.userId?.name}</span>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Reservation Date</label>
                  <input
                    type="date"
                    className="modern-input"
                    required
                    value={new Date(selectedReservation.date).toISOString().split('T')[0]}
                    onChange={(e) => setSelectedReservation({ ...selectedReservation, date: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Time Slot</label>
                  <select
                    className="modern-input"
                    value={selectedReservation.timeSlot}
                    onChange={(e) => setSelectedReservation({ ...selectedReservation, timeSlot: e.target.value })}
                  >
                    <option value="18:00 - 19:30">18:00 - 19:30</option>
                    <option value="19:30 - 21:00">19:30 - 21:00</option>
                    <option value="21:00 - 22:30">21:00 - 22:30</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Number of Guests</label>
                  <input
                    type="number"
                    className="modern-input"
                    min="1"
                    value={selectedReservation.guests}
                    onChange={(e) => setSelectedReservation({ ...selectedReservation, guests: Number(e.target.value) })}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Reservation Status</label>
                  <select
                    className="modern-input"
                    value={selectedReservation.status}
                    onChange={(e) => setSelectedReservation({ ...selectedReservation, status: e.target.value })}
                  >
                    <option value="booked">Booked</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Assigned Table</label>
                <select
                  className="modern-input"
                  value={selectedReservation.tableId?._id || ''}
                  onChange={(e) => {
                    const newTableId = e.target.value;
                    const tableObj = tables.find(t => t._id === newTableId);
                    setSelectedReservation({ ...selectedReservation, tableId: tableObj });
                  }}
                >
                  <option value="">Unassigned</option>
                  {tables.map(t => (
                    <option key={t._id} value={t._id}>Table {t.tableNumber} (Cap: {t.capacity})</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Save Changes</button>
                <button
                  type="button"
                  className="btn-danger"
                  onClick={() => {
                    handleCancelReservation(selectedReservation._id);
                    setSelectedReservation(null);
                  }}
                  style={{ flex: 1, border: selectedReservation.status === 'cancelled' ? '1px solid var(--danger)' : '1px solid var(--text-secondary)', color: selectedReservation.status === 'cancelled' ? 'var(--danger)' : 'var(--text-secondary)' }}
                >
                  {selectedReservation.status === 'cancelled' ? 'Delete Reservation' : 'Cancel Reservation'}
                </button>
                <button type="button" className="btn-danger" style={{ border: '1px solid var(--border-light)', color: 'var(--text-primary)' }} onClick={() => setSelectedReservation(null)}>Close</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReservations;
