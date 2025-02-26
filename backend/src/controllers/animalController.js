const { Animal, AnimalImage, User, Vaccination, sequelize } = require('../models');
const { Op } = require('sequelize');
const fs = require('fs');
const path = require('path');

// Get all animals with filtering options
exports.getAnimalsByFilter = async (req, res) => {
  try {
    const {
      species,
      breed,
      gender,
      ageMin,
      ageMax,
      size,
      adoptionStatus,
      goodWithKids,
      goodWithDogs,
      goodWithCats,
      page = 1,
      limit = 10,
      sort = 'createdAt',
      order = 'DESC',
      location
    } = req.query;

    // Build filter conditions
    const whereClause = {};
    
    if (species) whereClause.species = species;
    if (breed) whereClause.breed = { [Op.iLike]: `%${breed}%` };
    if (gender) whereClause.gender = gender;
    if (size) whereClause.size = size;
    if (adoptionStatus) whereClause.adoptionStatus = adoptionStatus;
    
    if (ageMin || ageMax) {
      whereClause.age = {};
      if (ageMin) whereClause.age[Op.gte] = parseInt(ageMin);
      if (ageMax) whereClause.age[Op.lte] = parseInt(ageMax);
    }
    
    if (goodWithKids === 'true') whereClause.goodWithKids = true;
    if (goodWithDogs === 'true') whereClause.goodWithDogs = true;
    if (goodWithCats === 'true') whereClause.goodWithCats = true;
    
    if (location) whereClause.location = { [Op.iLike]: `%${location}%` };

    // Calculate offset for pagination
    const offset = (page - 1) * limit;
    
    // Query animals with pagination
    const { count, rows } = await Animal.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: AnimalImage,
          as: 'images',
          attributes: ['id', 'imageUrl', 'isPrimary'],
          where: {
            isPrimary: true
          },
          required: false
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ],
      order: [[sort, order]],
      limit: parseInt(limit),
      offset: offset
    });

    // Calculate total pages
    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      success: true,
      count,
      totalPages,
      currentPage: parseInt(page),
      animals: rows
    });
  } catch (error) {
    console.error('Get animals error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve animals',
      error: error.message
    });
  }
};

// Get animal by ID
exports.getAnimalById = async (req, res) => {
  try {
    const { id } = req.params;

    const animal = await Animal.findByPk(id, {
      include: [
        {
          model: AnimalImage,
          as: 'images',
          attributes: ['id', 'imageUrl', 'isPrimary', 'caption', 'order']
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone']
        },
        {
          model: Vaccination,
          as: 'vaccinations',
          attributes: ['id', 'name', 'date', 'expirationDate', 'veterinarian']
        }
      ]
    });

    if (!animal) {
      return res.status(404).json({
        success: false,
        message: 'Animal not found'
      });
    }

    res.status(200).json({
      success: true,
      animal
    });
  } catch (error) {
    console.error('Get animal by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve animal',
      error: error.message
    });
  }
};

// Create new animal
exports.createAnimal = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const {
      name,
      species,
      breed,
      age,
      gender,
      size,
      color,
      description,
      healthStatus,
      behavior,
      specialNeeds,
      specialNeedsDescription,
      houseTrained,
      goodWithKids,
      goodWithDogs,
      goodWithCats,
      microchipped,
      microchipId,
      neutered,
      vaccinated,
      adoptionFee,
      location
    } = req.body;

    // Create animal record
    const animal = await Animal.create({
      name,
      species,
      breed,
      age,
      gender,
      size,
      color,
      description,
      healthStatus,
      behavior,
      specialNeeds,
      specialNeedsDescription,
      houseTrained,
      goodWithKids,
      goodWithDogs,
      goodWithCats,
      microchipped,
      microchipId,
      neutered,
      vaccinated,
      adoptionFee,
      location,
      adoptionStatus: 'available',
      createdById: req.user.id
    }, { transaction });

    // Commit transaction
    await transaction.commit();

    res.status(201).json({
      success: true,
      message: 'Animal created successfully',
      animal
    });
  } catch (error) {
    // Rollback transaction in case of error
    await transaction.rollback();
    
    console.error('Create animal error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create animal',
      error: error.message
    });
  }
};

// Update animal details
exports.updateAnimal = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find animal
    const animal = await Animal.findByPk(id);
    
    if (!animal) {
      return res.status(404).json({
        success: false,
        message: 'Animal not found'
      });
    }
    
    // Check if user is creator or admin
    if (animal.createdById !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this animal'
      });
    }
    
    // Update fields
    const updatedAnimal = await animal.update(req.body);
    
    res.status(200).json({
      success: true,
      message: 'Animal updated successfully',
      animal: updatedAnimal
    });
  } catch (error) {
    console.error('Update animal error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update animal',
      error: error.message
    });
  }
};

// Delete animal
exports.deleteAnimal = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    
    // Find animal
    const animal = await Animal.findByPk(id);
    
    if (!animal) {
      return res.status(404).json({
        success: false,
        message: 'Animal not found'
      });
    }
    
    // Check if user is creator or admin
    if (animal.createdById !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this animal'
      });
    }
    
    // Delete animal record
    await animal.destroy({ transaction });
    
    // Commit transaction
    await transaction.commit();
    
    res.status(200).json({
      success: true,
      message: 'Animal deleted successfully'
    });
  } catch (error) {
    // Rollback transaction in case of error
    await transaction.rollback();
    
    console.error('Delete animal error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete animal',
      error: error.message
    });
  }
};

// Add animal image
exports.addAnimalImage = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verify animal exists
    const animal = await Animal.findByPk(id);
    if (!animal) {
      return res.status(404).json({
        success: false,
        message: 'Animal not found'
      });
    }
    
    // Check authorization
    if (animal.createdById !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add images to this animal'
      });
    }
    
    // Check if file exists
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }
    
    const { isPrimary, caption, order } = req.body;
    
    // If setting as primary, update existing primary images
    if (isPrimary === 'true') {
      await AnimalImage.update(
        { isPrimary: false },
        { where: { animalId: id, isPrimary: true } }
      );
    }
    
    // Create image record
    const imageUrl = `/uploads/animals/${req.file.filename}`;
    const animalImage = await AnimalImage.create({
      animalId: id,
      imageUrl,
      isPrimary: isPrimary === 'true',
      caption,
      order: order || 0
    });
    
    res.status(201).json({
      success: true,
      message: 'Image added successfully',
      image: animalImage
    });
  } catch (error) {
    console.error('Add animal image error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add image',
      error: error.message
    });
  }
};

// Remove animal image
exports.deleteAnimalImage = async (req, res) => {
  try {
    const { animalId, imageId } = req.params;
    
    // Verify animal exists
    const animal = await Animal.findByPk(animalId);
    if (!animal) {
      return res.status(404).json({
        success: false,
        message: 'Animal not found'
      });
    }
    
    // Check authorization
    if (animal.createdById !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to remove images from this animal'
      });
    }
    
    // Find image
    const image = await AnimalImage.findOne({
      where: {
        id: imageId,
        animalId: animalId
      }
    });
    
    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }
    
    // Delete image file from filesystem if it exists
    const imagePath = path.join(process.env.UPLOAD_PATH, image.imageUrl.replace('/uploads/', ''));
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
    
    // Delete image record
    await image.destroy();
    
    // If the deleted image was primary, set the first remaining image as primary
    if (image.isPrimary) {
      const remainingImage = await AnimalImage.findOne({
        where: { animalId: id }
      });
      
      if (remainingImage) {
        await remainingImage.update({ isPrimary: true });
      }
    }
    
    res.status(200).json({
      success: true,
      message: 'Image removed successfully'
    });
  } catch (error) {
    console.error('Remove animal image error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove image',
      error: error.message
    });
  }
}; 