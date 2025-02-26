const User = require('./User');
const Animal = require('./Animal');
const AnimalImage = require('./AnimalImage');
const Adoption = require('./Adoption');
const Vaccination = require('./Vaccination');
const { sequelize } = require('../config/database');

// Define associations

// User - Animal associations (creator)
User.hasMany(Animal, { as: 'createdAnimals', foreignKey: 'createdById' });
Animal.belongsTo(User, { as: 'creator', foreignKey: 'createdById' });

// User - Animal associations (adopter)
User.hasMany(Animal, { as: 'adoptedAnimals', foreignKey: 'adoptedById' });
Animal.belongsTo(User, { as: 'adopter', foreignKey: 'adoptedById' });

// Animal - AnimalImage associations
Animal.hasMany(AnimalImage, { as: 'images', foreignKey: 'animalId', onDelete: 'CASCADE' });
AnimalImage.belongsTo(Animal, { foreignKey: 'animalId' });

// Animal - Vaccination associations
Animal.hasMany(Vaccination, { as: 'vaccinations', foreignKey: 'animalId', onDelete: 'CASCADE' });
Vaccination.belongsTo(Animal, { foreignKey: 'animalId' });

// User - Adoption associations (applicant)
User.hasMany(Adoption, { as: 'applications', foreignKey: 'applicantId' });
Adoption.belongsTo(User, { as: 'applicant', foreignKey: 'applicantId' });

// User - Adoption associations (reviewer)
User.hasMany(Adoption, { as: 'reviewedApplications', foreignKey: 'reviewedBy' });
Adoption.belongsTo(User, { as: 'reviewer', foreignKey: 'reviewedBy' });

// Animal - Adoption associations
Animal.hasMany(Adoption, { as: 'applications', foreignKey: 'animalId' });
Adoption.belongsTo(Animal, { foreignKey: 'animalId' });

// Sync models with database
const syncDatabase = async (options = {}) => {
  try {
    await sequelize.sync(options);
    console.log('Database synchronized successfully');
  } catch (error) {
    console.error('Failed to synchronize database:', error);
    throw error;
  }
};

module.exports = {
  User,
  Animal,
  AnimalImage,
  Adoption,
  Vaccination,
  sequelize,
  syncDatabase
}; 