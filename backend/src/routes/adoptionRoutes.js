const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');

// Create an adoption controller if it doesn't exist
const adoptionController = {
  createAdoptionRequest: async (req, res) => {
    try {
      const { Adoption } = require('../models');
      const { animalId } = req.body;
      const applicantId = req.user.id;

      // Check if the animal exists
      const { Animal } = require('../models');
      const animal = await Animal.findByPk(animalId);
      if (!animal) {
        return res.status(404).json({ message: 'Animal not found' });
      }

      // Check if the animal is already adopted
      if (animal.status === 'adopted') {
        return res.status(400).json({ message: 'This animal has already been adopted' });
      }

      // Check if the user already has a pending application for this animal
      const existingApplication = await Adoption.findOne({
        where: {
          animalId,
          applicantId,
          status: ['pending', 'approved']
        }
      });

      if (existingApplication) {
        return res.status(400).json({ 
          message: `You already have a ${existingApplication.status} application for this animal` 
        });
      }

      // Create the adoption request
      const adoptionRequest = await Adoption.create({
        animalId,
        applicantId,
        status: 'pending',
        applicationDate: new Date()
      });

      res.status(201).json(adoptionRequest);
    } catch (error) {
      console.error('Error creating adoption request:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  getUserAdoptions: async (req, res) => {
    try {
      const { Adoption, Animal } = require('../models');
      const userId = req.user.id;

      const adoptions = await Adoption.findAll({
        where: { applicantId: userId },
        include: [{
          model: Animal,
          as: 'animal'
        }],
        order: [['applicationDate', 'DESC']]
      });

      res.json(adoptions);
    } catch (error) {
      console.error('Error fetching user adoptions:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  getAdoptionById: async (req, res) => {
    try {
      const { Adoption, Animal, User } = require('../models');
      const { id } = req.params;
      const userId = req.user.id;

      const adoption = await Adoption.findOne({
        where: { id },
        include: [
          {
            model: Animal,
            as: 'animal'
          },
          {
            model: User,
            as: 'applicant',
            attributes: ['id', 'name', 'email', 'phone']
          }
        ]
      });

      if (!adoption) {
        return res.status(404).json({ message: 'Adoption request not found' });
      }

      // Make sure the user is the applicant or an admin
      if (adoption.applicantId !== userId && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to view this adoption request' });
      }

      res.json(adoption);
    } catch (error) {
      console.error('Error fetching adoption:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  updateAdoptionStatus: async (req, res) => {
    try {
      const { Adoption, Animal } = require('../models');
      const { id } = req.params;
      const { status } = req.body;
      const reviewerId = req.user.id;

      // Validate status
      if (!['pending', 'approved', 'rejected', 'completed'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status value' });
      }

      // Find the adoption request
      const adoption = await Adoption.findByPk(id);
      if (!adoption) {
        return res.status(404).json({ message: 'Adoption request not found' });
      }

      // Only admins can update adoption status
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to update adoption status' });
      }

      // Update the adoption request
      adoption.status = status;
      adoption.reviewedBy = reviewerId;
      adoption.reviewDate = new Date();
      await adoption.save();

      // If approved, update the animal status
      if (status === 'approved') {
        const animal = await Animal.findByPk(adoption.animalId);
        if (animal) {
          animal.status = 'adopted';
          animal.adoptedById = adoption.applicantId;
          await animal.save();
        }
      }

      res.json(adoption);
    } catch (error) {
      console.error('Error updating adoption status:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};

const router = express.Router();

/**
 * @route   POST /api/adoptions
 * @desc    Create adoption request
 * @access  Private
 */
router.post('/', authMiddleware, adoptionController.createAdoptionRequest);

/**
 * @route   GET /api/adoptions/user
 * @desc    Get all adoptions for the current user
 * @access  Private
 */
router.get('/user', authMiddleware, adoptionController.getUserAdoptions);

/**
 * @route   GET /api/adoptions/:id
 * @desc    Get adoption by ID
 * @access  Private
 */
router.get('/:id', authMiddleware, adoptionController.getAdoptionById);

/**
 * @route   PUT /api/adoptions/:id/status
 * @desc    Update adoption status
 * @access  Private (Admin only)
 */
router.put('/:id/status', authMiddleware, adoptionController.updateAdoptionStatus);

module.exports = router; 