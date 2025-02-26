const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');

// Create a user controller if it doesn't exist
const userController = {
  getAllUsers: async (req, res) => {
    try {
      const { User } = require('../models');
      
      // Check if user is admin
      if (req.user.role !== 'admin') {
        return res.status(403).json({ 
          success: false,
          message: 'Access denied. Admin privileges required.' 
        });
      }
      
      const users = await User.findAll({
        attributes: { exclude: ['password'] } // Don't send passwords in response
      });
      
      res.status(200).json({
        success: true,
        count: users.length,
        users
      });
    } catch (error) {
      console.error('Error fetching all users:', error);
      res.status(500).json({ 
        success: false,
        message: 'Server error', 
        error: error.message 
      });
    }
  },

  getPublicUsers: async (req, res) => {
    try {
      const { User } = require('../models');
      
      // Get limited user data for public display
      const users = await User.findAll({
        attributes: ['id', 'firstName', 'lastName', 'city', 'state', 'avatar', 'memberSince'],
        where: { isActive: true }
      });
      
      res.status(200).json({
        success: true,
        count: users.length,
        users
      });
    } catch (error) {
      console.error('Error fetching public users:', error);
      res.status(500).json({ 
        success: false,
        message: 'Server error', 
        error: error.message 
      });
    }
  },

  getUserById: async (req, res) => {
    try {
      const { User } = require('../models');
      const { id } = req.params;
      
      const user = await User.findByPk(id, {
        attributes: { exclude: ['password'] } // Don't send password in response
      });
      
      if (!user) {
        return res.status(404).json({ 
          success: false,
          message: 'User not found' 
        });
      }
      
      res.status(200).json({
        success: true,
        user
      });
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      res.status(500).json({ 
        success: false,
        message: 'Server error', 
        error: error.message 
      });
    }
  },

  getUserProfile: async (req, res) => {
    try {
      const { User } = require('../models');
      const userId = req.user.id;

      const user = await User.findByPk(userId, {
        attributes: { exclude: ['password'] } // Don't send password in response
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  updateUserProfile: async (req, res) => {
    try {
      const { User } = require('../models');
      const userId = req.user.id;
      const { name, phone, location } = req.body;

      // Get the user
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Update only the fields that are provided
      if (name) user.name = name;
      if (phone) user.phone = phone;
      if (location) user.location = location;

      await user.save();

      // Don't send password in response
      const { password, ...userResponse } = user.toJSON();
      
      res.json(userResponse);
    } catch (error) {
      console.error('Error updating user profile:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  getUserPets: async (req, res) => {
    try {
      const { User, Animal, AnimalImage } = require('../models');
      const userId = req.user.id;

      const user = await User.findByPk(userId, {
        include: [
          {
            model: Animal,
            as: 'adoptedAnimals',
            include: [
              {
                model: AnimalImage,
                as: 'images'
              }
            ]
          }
        ]
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(user.adoptedAnimals);
    } catch (error) {
      console.error('Error fetching user pets:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};

const router = express.Router();

/**
 * @route   GET /api/users
 * @desc    Get all users (admin only)
 * @access  Private/Admin
 */
router.get('/', authMiddleware, userController.getAllUsers);

/**
 * @route   GET /api/users/public
 * @desc    Get public user list (limited data)
 * @access  Public
 */
router.get('/public', userController.getPublicUsers);

/**
 * @route   GET /api/users/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile', authMiddleware, userController.getUserProfile);

/**
 * @route   PUT /api/users/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', authMiddleware, userController.updateUserProfile);

/**
 * @route   GET /api/users/pets
 * @desc    Get current user's pets
 * @access  Private
 */
router.get('/pets', authMiddleware, userController.getUserPets);

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Private
 */
router.get('/:id', authMiddleware, userController.getUserById);

module.exports = router; 