// routes/properties.js
const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const prisma = new PrismaClient()

// -------- GET all properties --------
router.get('/', authenticateToken, async (req, res) => {
  try {
    // Only owners can access their own properties
    if (req.user.role !== 'owner') {
      return res.status(403).json({ error: 'Access denied. Only owners can view properties.' })
    }
    
    const properties = await prisma.property.findMany({
      where: {
        ownerId: req.user.id
      }
    })
    res.json(properties)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch properties' })
  }
})

// -------- GET property by ID --------
router.get('/:id', authenticateToken, async (req, res) => {
  const propertyId = Number(req.params.id)
  try {
    const property = await prisma.property.findUnique({ where: { id: propertyId } })
    if (!property) return res.status(404).json({ error: 'Property not found' })
    res.json(property)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch property' })
  }
})

// -------- POST new property --------
router.post('/', authenticateToken, async (req, res) => {
  // Only owners can create properties
  if (req.user.role !== 'owner') {
    return res.status(403).json({ error: 'Access denied. Only owners can create properties.' })
  }
  
  const data = {
    ...req.body,
    ownerId: req.user.id // Associate property with the owner
  }
  
  try {
    const property = await prisma.property.create({ data })
    res.status(201).json(property)
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(400).json({ error: 'Failed to create property', details: error.message })
  }
})

// -------- PATCH update property by ID --------
router.patch('/:id', authenticateToken, async (req, res) => {
  // Only owners can update their own properties
  if (req.user.role !== 'owner') {
    return res.status(403).json({ error: 'Access denied. Only owners can update properties.' })
  }
  
  const propertyId = Number(req.params.id)
  
  // Check if the property belongs to the owner
  const property = await prisma.property.findUnique({ 
    where: { id: propertyId },
    select: { ownerId: true }
  })
  
  if (!property) {
    return res.status(404).json({ error: 'Property not found' })
  }
  
  if (property.ownerId !== req.user.id) {
    return res.status(403).json({ error: 'Access denied. You can only update your own properties.' })
  }
  
  // Process the request body to handle the new fields
  const data = {
    ...req.body,
    homeValue: req.body.homeValue ? Number(req.body.homeValue) : undefined,
    useZestimate: req.body.useZestimate !== undefined ? Boolean(req.body.useZestimate) : undefined
  };
  
  try {
    const updatedProperty = await prisma.property.update({ where: { id: propertyId }, data })
    res.json(updatedProperty)
  } catch (error) {
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Property not found' })
    } else {
      res.status(400).json({ error: 'Failed to update property', details: error.message })
    }
  }
})

// -------- DELETE property by ID --------
router.delete('/:id', authenticateToken, async (req, res) => {
  // Only owners can delete their own properties
  if (req.user.role !== 'owner') {
    return res.status(403).json({ error: 'Access denied. Only owners can delete properties.' })
  }
  
  const propertyId = Number(req.params.id)
  
  // Check if the property belongs to the owner
  const property = await prisma.property.findUnique({ 
    where: { id: propertyId },
    select: { ownerId: true }
  })
  
  if (!property) {
    return res.status(404).json({ error: 'Property not found' })
  }
  
  if (property.ownerId !== req.user.id) {
    return res.status(403).json({ error: 'Access denied. You can only delete your own properties.' })
  }
  
  try {
    await prisma.property.delete({ where: { id: propertyId } })
    // Also delete any related analysis
    await prisma.propertyAnalysis.deleteMany({ where: { propertyId } })
    res.status(200).json({ success: true })
  } catch (error) {
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Property not found' })
    } else {
      res.status(400).json({ error: 'Failed to delete property', details: error.message })
    }
  }
})

/* =====================================================
    RETURN ANALYSIS ENDPOINTS (save/load per property)
   ===================================================== */

// GET saved analysis for a property
router.get('/:id/analysis', authenticateToken, async (req, res) => {
  const propertyId = Number(req.params.id)
  try {
    const analysis = await prisma.propertyAnalysis.findUnique({ where: { propertyId } })
    if (!analysis) {
      return res.status(404).json({ error: 'No analysis found for this property' })
    }
    res.json(analysis)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analysis' })
  }
})

// SAVE/overwrite analysis for a property
router.post('/:id/analysis', authenticateToken, async (req, res) => {
  const propertyId = Number(req.params.id)
  const analysisData = req.body
  try {
    // Upsert: create or update analysis for property
    const analysis = await prisma.propertyAnalysis.upsert({
      where: { propertyId },
      update: { ...analysisData },
      create: { propertyId, ...analysisData },
    })
    res.json({ success: true, analysis })
  } catch (error) {
    res.status(400).json({ error: 'Failed to save analysis', details: error.message })
  }
})

module.exports = router
