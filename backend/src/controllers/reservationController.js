const Reservation = require('../models/Reservation');
const Table = require('../models/Table');

// @desc    Get all reservations (Admin sees all, Customer sees theirs)
// @route   GET /api/reservations
// @access  Private
const getReservations = async (req, res) => {
  try {
    let query = {};
    if (req.user.role !== 'admin') {
      query.userId = req.user.id;
    }

    const reservations = await Reservation.find(query)
      .populate('tableId', 'tableNumber capacity')
      .populate('userId', 'name email')
      .sort({ date: 1, timeSlot: 1 });

    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a reservation
// @route   POST /api/reservations
// @access  Private
const createReservation = async (req, res) => {
  const { date, timeSlot, guests } = req.body;

  try {
    // Basic validation
    if (!date || !timeSlot || !guests) {
      return res.status(400).json({ message: 'Please provide date, timeSlot, and guests' });
    }

    // Prevent past bookings
    const reservationDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Ignore time for today's date

    if (reservationDate < today) {
      return res.status(400).json({ message: 'Reservations cannot be made for past dates' });
    }

    // 1. Find all active tables with enough capacity, sorted by capacity (smallest that fits first).
    const allEligibleTables = await Table.find({
      isActive: true,
      capacity: { $gte: Number(guests) },
    }).sort({ capacity: 1 });

    if (allEligibleTables.length === 0) {
      return res.status(400).json({ message: 'No tables large enough for this party size exist.' });
    }

    let assignedTableId = null;

    // Helper function to check conflicts for a list of tables
    const findAvailableTable = async (tableList) => {
      for (const table of tableList) {
        const conflict = await Reservation.findOne({
          tableId: table._id,
          date: new Date(date),
          timeSlot: timeSlot,
          status: 'booked',
        });
        if (!conflict) return table._id;
      }
      return null;
    };

    // Phase 1: Try to apply the "Maximum Seating Waste Rule" (Ideal Tables)
    // Only look at tables that leave 2 or fewer seats empty.
    const idealTables = allEligibleTables.filter(t => t.capacity <= Number(guests) + 2);
    assignedTableId = await findAvailableTable(idealTables);

    // Phase 2: Fallback Mechanism (Any Table)
    // If all ideal tables are taken, but we still have massive tables empty, we'd rather take the booking than lose revenue!
    if (!assignedTableId) {
      const remainingTables = allEligibleTables.filter(t => t.capacity > Number(guests) + 2);
      assignedTableId = await findAvailableTable(remainingTables);
    }

    // 3. If no table is available at all
    if (!assignedTableId) {
      return res.status(400).json({ message: 'No tables available for the selected date and time slot' });
    }

    // 4. Create the reservation
    const reservation = await Reservation.create({
      userId: req.user.id,
      tableId: assignedTableId,
      date: new Date(date),
      timeSlot,
      guests,
      status: 'booked',
    });

    const populatedReservation = await Reservation.findById(reservation._id).populate('tableId', 'tableNumber capacity');

    res.status(201).json(populatedReservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel a reservation
// @route   DELETE /api/reservations/:id
// @access  Private
const cancelReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    // Check ownership or admin
    if (reservation.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to cancel this reservation' });
    }

    // If already cancelled, allow admin to hard delete
    if (reservation.status === 'cancelled') {
      if (req.user.role === 'admin') {
        await Reservation.findByIdAndDelete(req.params.id);
        return res.json({ message: 'Reservation permanently deleted' });
      } else {
        return res.status(400).json({ message: 'Reservation is already cancelled' });
      }
    }

    reservation.status = 'cancelled';
    await reservation.save();

    res.json({ message: 'Reservation cancelled successfully', reservation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a reservation (Admin only - e.g., to manually move to another table or change status)
// @route   PUT /api/reservations/:id
// @access  Private/Admin
const updateReservation = async (req, res) => {
  const { tableId, date, timeSlot, guests, status } = req.body;

  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    reservation.tableId = tableId || reservation.tableId;
    reservation.date = date ? new Date(date) : reservation.date;
    reservation.timeSlot = timeSlot || reservation.timeSlot;
    reservation.guests = guests || reservation.guests;
    reservation.status = status || reservation.status;

    // Optional: Could add validation here to ensure updated table/time doesn't cause a conflict
    
    const updatedReservation = await reservation.save();
    res.json(updatedReservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getReservations,
  createReservation,
  cancelReservation,
  updateReservation,
};
