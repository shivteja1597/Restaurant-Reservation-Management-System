const AdminTables = ({ tables, reservations }) => {

  // A helper function to determine the current status of a table.
  // For simplicity, we check if the table has any 'booked' reservation today at the current time.
  // Since our app operates on strict timeslots, let's just find the first active booking for today.
  const getTableStatus = (tableId) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const activeRes = reservations.find(res => 
      res.tableId?._id === tableId && 
      res.status === 'booked' && 
      new Date(res.date).toISOString().split('T')[0] === todayStr
    );
    
    return activeRes 
      ? { status: 'Reserved', res: activeRes } 
      : { status: 'Available', res: null };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h2 style={{ fontSize: '1.875rem', marginBottom: '0.5rem' }}>All Tables Overview</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Live floor status</p>
      </div>
      
      <div style={{ overflowX: 'auto' }}>
        <table className="modern-table">
          <thead>
            <tr>
              <th>Table ID</th>
              <th>Capacity</th>
              <th>Current Status</th>
              <th>Reservation Details</th>
            </tr>
          </thead>
          <tbody>
            {tables.map((table) => {
            const tableInfo = getTableStatus(table._id);
            return (
              <tr key={table._id}>
                <td><span style={{ fontWeight: '600' }}>Table {table.tableNumber}</span></td>
                <td>{table.capacity} Guests</td>
                <td>
                  <span className={`badge ${tableInfo.status === 'Reserved' ? 'badge-danger' : 'badge-success'}`}>
                    {tableInfo.status}
                  </span>
                </td>
                <td>
                  {tableInfo.res ? (
                    <div style={{ fontSize: '0.875rem' }}>
                      <p><strong style={{ color: 'var(--text-secondary)' }}>Customer:</strong> {tableInfo.res.userId?.name}</p>
                      <p><strong style={{ color: 'var(--text-secondary)' }}>Time:</strong> {tableInfo.res.timeSlot}</p>
                      <p><strong style={{ color: 'var(--text-secondary)' }}>Guests:</strong> {tableInfo.res.guests}</p>
                    </div>
                  ) : (
                    <span style={{ color: 'var(--text-secondary)' }}>None</span>
                  )}
                </td>
              </tr>
            );
          })}
          {tables.length === 0 && (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>No tables available in the database.</td>
            </tr>
          )}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default AdminTables;
