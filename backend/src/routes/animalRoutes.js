const express = require('express');
const { 
  getAllAnimals, 
  getAnimalById, 
  createAnimal, 
  updateAnimal, 
  deleteAnimal,
  addAnimalImage,
  deleteAnimalImage,
  getAnimalsByFilter
} = require('../controllers/animalController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @route   GET /api/animals
 * @desc    Get all animals (with optional filters)
 * @access  Public
 */
router.get('/', getAnimalsByFilter);

/**
 * @route   GET /api/animals/:id
 * @desc    Get animal by ID
 * @access  Public
 */
router.get('/:id', getAnimalById);

/**
 * @route   POST /api/animals
 * @desc    Create a new animal
 * @access  Private
 */
router.post('/', authMiddleware, createAnimal);

/**
 * @route   PUT /api/animals/:id
 * @desc    Update an animal
 * @access  Private
 */
router.put('/:id', authMiddleware, updateAnimal);

/**
 * @route   DELETE /api/animals/:id
 * @desc    Delete an animal
 * @access  Private
 */
router.delete('/:id', authMiddleware, deleteAnimal);

/**
 * @route   POST /api/animals/:id/images
 * @desc    Add an image to an animal
 * @access  Private
 */
router.post('/:id/images', authMiddleware, addAnimalImage);

/**
 * @route   DELETE /api/animals/:animalId/images/:imageId
 * @desc    Delete an image from an animal
 * @access  Private
 */
router.delete('/:animalId/images/:imageId', authMiddleware, deleteAnimalImage);

module.exports = router; 