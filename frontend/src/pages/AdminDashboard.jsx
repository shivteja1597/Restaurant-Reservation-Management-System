import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import AdminOverview from './admin/AdminOverview';
import AdminReservations from './admin/AdminReservations';
import AdminTables from './admin/AdminTables';
import { API_URL } from '../config';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  
  // Navigation State
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem('adminActiveTab') || 'dashboard');

  useEffect(() => {
    localStorage.setItem('adminActiveTab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    fetchReservations();
    fetchTables();
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

  const fetchTables = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`${API_URL}/api/tables`, config);
      setTables(data);
    } catch (error) {
      console.error('Error fetching tables:', error);
    }
  };

  const handleCancelReservation = async (id) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`${API_URL}/api/reservations/${id}`, config);
      fetchReservations();
    } catch (error) {
      console.error('Error cancelling reservation:', error);
    }
  };

  const handleUpdateReservation = async (updatedRes) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(
        `${API_URL}/api/reservations/${updatedRes._id}`, 
        { 
          tableId: updatedRes.tableId?._id, 
          date: updatedRes.date,
          timeSlot: updatedRes.timeSlot,
          guests: updatedRes.guests,
          status: updatedRes.status
        }, 
        config
      );
      fetchReservations();
    } catch (error) {
      console.error('Error updating reservation:', error);
    }
  };

  return (
    <div style={{ display: 'flex', flex: 1, width: '100%', padding: '0 1rem 1rem 1rem', gap: '1rem', overflow: 'hidden' }}>
      {/* Sidebar Navigation */}
      <aside className="glass-panel" style={{ width: '250px', display: 'flex', flexDirection: 'column', padding: '1rem 0' }}>
        <h2 style={{ padding: '0 1.5rem 1rem 1.5rem', borderBottom: '1px solid var(--border-light)', margin: 0, color: 'var(--text-secondary)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Admin Panel</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', marginTop: '1rem', padding: '0 1rem', gap: '0.5rem' }}>
          <button 
            onClick={() => setActiveTab('dashboard')} 
            style={{ 
              padding: '0.75rem 1rem', 
              textAlign: 'left', 
              border: 'none', 
              background: activeTab === 'dashboard' ? 'var(--border-glow)' : 'transparent', 
              color: activeTab === 'dashboard' ? 'var(--accent-gold)' : 'var(--text-primary)',
              borderRadius: '6px',
              cursor: 'pointer', 
              transition: 'all 0.2s ease',
              fontWeight: activeTab === 'dashboard' ? '600' : '400'
            }}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('reservations')} 
            style={{ 
              padding: '0.75rem 1rem', 
              textAlign: 'left', 
              border: 'none', 
              background: activeTab === 'reservations' ? 'var(--border-glow)' : 'transparent', 
              color: activeTab === 'reservations' ? 'var(--accent-gold)' : 'var(--text-primary)',
              borderRadius: '6px',
              cursor: 'pointer', 
              transition: 'all 0.2s ease',
              fontWeight: activeTab === 'reservations' ? '600' : '400'
            }}
          >
            Reservations
          </button>
          <button 
            onClick={() => setActiveTab('tables')} 
            style={{ 
              padding: '0.75rem 1rem', 
              textAlign: 'left', 
              border: 'none', 
              background: activeTab === 'tables' ? 'var(--border-glow)' : 'transparent', 
              color: activeTab === 'tables' ? 'var(--accent-gold)' : 'var(--text-primary)',
              borderRadius: '6px',
              cursor: 'pointer', 
              transition: 'all 0.2s ease',
              fontWeight: activeTab === 'tables' ? '600' : '400'
            }}
          >
            Tables
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="glass-panel" style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        {activeTab === 'dashboard' && <AdminOverview tables={tables} reservations={reservations} />}
        {activeTab === 'reservations' && (
          <AdminReservations 
            tables={tables} 
            reservations={reservations} 
            handleCancelReservation={handleCancelReservation} 
            handleUpdateReservation={handleUpdateReservation} 
          />
        )}
        {activeTab === 'tables' && <AdminTables tables={tables} reservations={reservations} />}
      </main>
    </div>
  );
};

export default AdminDashboard;
