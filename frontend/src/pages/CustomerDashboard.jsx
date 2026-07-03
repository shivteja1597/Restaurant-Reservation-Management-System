import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { API_URL } from '../config';

const CustomerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [reservations, setReservations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [guests, setGuests] = useState(1);
  const [errorMsg, setErrorMsg] = useState('');
  const availableSlots = [
    "12:00 - 13:30", 
    "13:30 - 15:00", 
    "15:00 - 16:30", 
    "16:30 - 18:00", 
    "18:00 - 19:30", 
    "19:30 - 21:00", 
    "21:00 - 22:30"
  ];
  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`${API_URL}/api/reservations`, config);
      setReservations(data);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  };

  const handleBook = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(`${API_URL}/api/reservations`, { date, timeSlot, guests }, config);
      setShowModal(false);
      fetchReservations(); // Refresh list
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Failed to create reservation');
    }
  };

  const handleCancel = async (id) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`${API_URL}/api/reservations/${id}`, config);
      fetchReservations(); // Refresh list
    } catch (error) {
      console.error('Error cancelling reservation:', error);
    }
  };

  return (
    <div style={{ padding: '1rem', width: '100%', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="serif-heading" style={{ fontSize: '1.875rem', marginBottom: '0.5rem' }}>My Reservations</h2>
          <p style={{ color: 'var(--text-secondary)' }}>View and manage your upcoming dining experiences</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="btn-primary"
        >
          Book a Table
        </button>
      </div>

      <div className="glass-card" style={{ padding: '0' }}>
        {reservations.length === 0 ? (
          <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>You have no reservations yet.</p>
        ) : (
          <div style={{ overflowX: 'auto', padding: '1rem' }}>
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Guests</th>
                  <th>Table</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((res) => (
                  <tr key={res._id}>
                    <td>{new Date(res.date).toLocaleDateString()}</td>
                    <td>{res.timeSlot}</td>
                    <td>{res.guests}</td>
                    <td>{res.tableId ? res.tableId.tableNumber : <span style={{color: 'var(--text-secondary)'}}>N/A</span>}</td>
                    <td>
                      <span className={`badge ${res.status === 'booked' ? 'badge-success' : 'badge-danger'}`}>
                        {res.status}
                      </span>
                    </td>
                    <td>
                      {res.status === 'booked' && (
                        <button 
                          onClick={() => handleCancel(res._id)}
                          className="btn-danger" style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(2, 6, 23, 0.8)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 50 }}>
          <div className="glass-panel" style={{ padding: '2rem', width: '100%', maxWidth: '400px', margin: '1rem' }}>
            <h3 className="serif-heading" style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--accent-gold)' }}>New Reservation</h3>
            {errorMsg && <div style={{ color: 'var(--danger)', marginBottom: '1rem', background: 'rgba(239, 68, 68, 0.1)', padding: '0.5rem', borderRadius: '4px', textAlign: 'center' }}>{errorMsg}</div>}
            
            <form onSubmit={handleBook} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Date</label>
                <input 
                  type="date" 
                  className="modern-input"
                  required 
                  min={new Date().toISOString().split('T')[0]}
                  value={date} 
                  onChange={(e) => setDate(e.target.value)} 
                />
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Time</label>
                <select className="modern-input" required value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)}>
                  <option value="">Select a time slot</option>
                  {availableSlots.map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Number of Guests</label>
                <input 
                  type="number" 
                  className="modern-input" 
                  min="1" 
                  max="20" 
                  required 
                  placeholder="Number of guests" 
                  value={guests} 
                  onChange={(e) => setGuests(e.target.value)} 
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Book</button>
                <button type="button" className="btn-danger" style={{ flex: 1, border: '1px solid var(--border-light)', color: 'var(--text-primary)' }} onClick={() => setShowModal(false)}>Close</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;
