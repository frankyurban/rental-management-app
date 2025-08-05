const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const prisma = new PrismaClient();

// -------- GET all tenants --------
router.get('/', authenticateToken, async (req, res) => {
  try {
    const tenants = await prisma.tenant.findMany();
    res.json(tenants);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tenants' });
  }
});

// -------- GET tenant by ID --------
router.get('/:id', authenticateToken, async (req, res) => {
  const tenantId = Number(req.params.id);
  try {
    const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) return res.status(404).json({ error: 'Tenant not found' });
    res.json(tenant);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tenant' });
  }
});

// -------- POST new tenant --------
router.post('/', authenticateToken, async (req, res) => {
  const data = req.body;
  try {
    const tenant = await prisma.tenant.create({ data });
    res.status(201).json(tenant);
  } catch (error) {
    console.error('Error creating tenant:', error);
    res.status(400).json({ error: 'Failed to create tenant', details: error.message });
  }
});

// -------- PATCH update tenant by ID --------
router.patch('/:id', authenticateToken, async (req, res) => {
  const tenantId = Number(req.params.id);
  const data = req.body;
  try {
    const tenant = await prisma.tenant.update({ where: { id: tenantId }, data });
    res.json(tenant);
  } catch (error) {
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Tenant not found' });
    } else {
      res.status(400).json({ error: 'Failed to update tenant', details: error.message });
    }
  }
});

// -------- DELETE tenant by ID --------
router.delete('/:id', authenticateToken, async (req, res) => {
  const tenantId = Number(req.params.id);
  try {
    await prisma.tenant.delete({ where: { id: tenantId } });
    res.status(200).json({ success: true });
  } catch (error) {
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Tenant not found' });
    } else {
      res.status(400).json({ error: 'Failed to delete tenant', details: error.message });
    }
  }
});

module.exports = router;
