const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const prisma = new PrismaClient();

// -------- GET all leases --------
router.get('/', authenticateToken, async (req, res) => {
  try {
    const leases = await prisma.lease.findMany({
      include: {
        tenant: true,
        property: true
      }
    });
    res.json(leases);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leases' });
  }
});

// -------- GET lease by ID --------
router.get('/:id', authenticateToken, async (req, res) => {
  const leaseId = Number(req.params.id);
  try {
    const lease = await prisma.lease.findUnique({
      where: { id: leaseId },
      include: {
        tenant: true,
        property: true
      }
    });
    if (!lease) return res.status(404).json({ error: 'Lease not found' });
    res.json(lease);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch lease' });
  }
});

// -------- POST new lease --------
router.post('/', authenticateToken, async (req, res) => {
  const data = req.body;
  try {
    const lease = await prisma.lease.create({ 
      data,
      include: {
        tenant: true,
        property: true
      }
    });
    res.status(201).json(lease);
  } catch (error) {
    console.error('Error creating lease:', error);
    res.status(400).json({ error: 'Failed to create lease', details: error.message });
  }
});

// -------- PATCH update lease by ID --------
router.patch('/:id', authenticateToken, async (req, res) => {
  const leaseId = Number(req.params.id);
  const data = req.body;
  try {
    const lease = await prisma.lease.update({ 
      where: { id: leaseId }, 
      data,
      include: {
        tenant: true,
        property: true
      }
    });
    res.json(lease);
  } catch (error) {
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Lease not found' });
    } else {
      res.status(400).json({ error: 'Failed to update lease', details: error.message });
    }
  }
});

// -------- DELETE lease by ID --------
router.delete('/:id', authenticateToken, async (req, res) => {
  const leaseId = Number(req.params.id);
  try {
    await prisma.lease.delete({ where: { id: leaseId } });
    res.status(200).json({ success: true });
  } catch (error) {
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Lease not found' });
    } else {
      res.status(400).json({ error: 'Failed to delete lease', details: error.message });
    }
  }
});

module.exports = router;
