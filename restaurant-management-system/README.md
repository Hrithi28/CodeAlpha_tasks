# Restaurant Management System

A robust Node.js and Express backend for managing restaurant operations including menu items, inventory, reservations, tables, orders, and generating reports. The system uses MongoDB with Mongoose for data persistence.

## Features

- **Menu Management**: Create, read, update, and delete menu items with categories and pricing.
- **Inventory Tracking**: Manage stock levels, ingredient tracking, and low-stock alerts.
- **Table Management**: Track table status, capacity, and assignments.
- **Reservation System**: Handle customer bookings and table allocations.
- **Order Processing**: Manage dine-in, takeout, or delivery orders, track order states from preparation to completion.
- **Reporting & Analytics**: Generate sales, inventory, and order-related insights.

## Tech Stack

- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) & [Mongoose](https://mongoosejs.com/)
- **Middleware**: `cors` for Cross-Origin Resource Sharing, `express.json()` for JSON body parsing, and `dotenv` for environment configuration.

## Project Structure

```text
restaurant-management-system/
├── models/             # Mongoose schemas (InventoryItem, MenuItem, Order, Reservation, Table)
├── routes/             # Express route handlers for each entity
├── .env                # Environment variables
├── package.json        # Project metadata and dependencies
└── server.js           # Express app entry point & DB connection
```

## Setup & Installation

1. **Clone or Download the repository**:
   ```bash
   cd restaurant-management-system
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env` file in the root directory (if not already present) and configure the following variables:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/restaurant_db
   ```

4. **Start the server**:
   ```bash
   node server.js
   ```

## API Endpoints

The API base URL is `http://localhost:<PORT>` (default 5000).

### General
- `GET /api/health` - Health check endpoint to verify server status.

### Menu Items
- `GET /api/menu` - Retrieve all menu items.
- `POST /api/menu` - Create a new menu item.
- `GET /api/menu/:id` - Retrieve a specific menu item.
- `PUT /api/menu/:id` - Update a menu item.
- `DELETE /api/menu/:id` - Delete a menu item.

### Inventory
- `GET /api/inventory` - Retrieve inventory items.
- `POST /api/inventory` - Add new inventory stock.
- `GET /api/inventory/:id` - Retrieve a specific inventory item.
- `PUT /api/inventory/:id` - Update an inventory item.
- `DELETE /api/inventory/:id` - Delete an inventory item.

### Tables
- `GET /api/tables` - Get all tables and their current status.
- `POST /api/tables` - Register a new table.
- `GET /api/tables/:id` - View details of a specific table.

### Reservations
- `GET /api/reservations` - View all reservations.
- `POST /api/reservations` - Create a new reservation.

### Orders
- `GET /api/orders` - View all orders.
- `POST /api/orders` - Place a new order.

### Reports
- `GET /api/reports/sales` (or other sub-routes based on logic) - Access reporting data.

## License

ISC License
