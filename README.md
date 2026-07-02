# Restaurant Reservation Management System

This is a reservation system for a single restaurant. Customers can sign up, pick a date, time slot, and how many guests they have — the backend automatically finds and assigns the best table. Admins have their own dashboard where they can manage tables, view all bookings, and update statuses.

Stack: React + Vite for the frontend, Node/Express for the backend, MongoDB for the database, JWT for authentication. Passwords are hashed using bcrypt.

## Setup

You need Node.js (v16+) and MongoDB running somewhere (local or Atlas, doesn't matter).

Backend:
```
cd backend
npm install
```

You'll need a .env file in the backend folder:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Then run it:
```
npm run dev
```

Frontend:
```
cd frontend
npm install
npm run dev
```

App should be running at http://localhost:5173.

To create the admin account, run `node seedAdmin.js` from the backend folder. It sets up admin@restaurant.com with password admin123. You can edit the script if you want different credentials.

## How the booking works

When a customer submits a reservation, the server looks for all active tables that can seat their party size. It sorts those tables smallest-first so a table for 2 doesn't end up getting a 6-seater. Then it checks each table against existing bookings for that same date and time slot. The first one without a conflict gets assigned. If nothing is available, the user sees an error. This prevents any double bookings.

## Auth setup

Standard JWT flow. When you log in, you get a token that has your user ID and role in it. On the backend there are two middleware functions — one called `protect` that verifies the token, and one called `admin` that checks the role before giving access to admin routes. On the frontend, AuthContext handles the login state and ProtectedRoute redirects customers away from admin pages.

## Assumptions

- This is built for one restaurant, not multiple locations
- Each table has a fixed capacity and can be set to active or inactive
- Time slots are hardcoded (18:00-19:30, 19:30-21:00, 21:00-22:30)
- The system picks the table for you, customers don't choose one manually

## Known issues / things I'd improve

- Time slots should ideally be configurable from the admin side
- You can't edit a reservation, only cancel and rebook
- No email or SMS confirmations right now
- Data fetching on the frontend uses basic useEffect — React Query would be cleaner
- No automated tests yet, would add Jest and Supertest for API testing
