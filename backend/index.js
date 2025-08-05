const express = require('express');
const cors = require('cors');

const propertiesRouter = require('./routes/properties');
const tenantsRouter = require('./routes/tenants');
const leasesRouter = require('./routes/leases');
const authRouter = require('./routes/auth');

const app = express();
const PORT = 5050;

app.use(cors());
app.use(express.json());

// Mount auth routes (no authentication required)
console.log("Mounting", '/api/auth');
app.use('/api/auth', authRouter);

// Mount protected routers (authentication required for these routes)
console.log("Mounting", '/api/properties');
app.use('/api/properties', propertiesRouter);

console.log("Mounting", '/api/tenants');
app.use('/api/tenants', tenantsRouter);

console.log("Mounting", '/api/leases');
app.use('/api/leases', leasesRouter);

// Test route
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

// 🔥 404 fallback route — place this LAST
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Debug: print all registered route paths and methods
app._router.stack.forEach(function(r){
  if (r.route && r.route.path) {
    console.log(`[${Object.keys(r.route.methods).join(', ').toUpperCase()}] ${r.route.path}`);
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
