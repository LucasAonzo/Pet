const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Animal = sequelize.define('Animal', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  species: {
    type: DataTypes.ENUM('dog', 'cat', 'bird', 'rabbit', 'hamster', 'guinea pig', 'fish', 'reptile', 'other'),
    allowNull: false,
  },
  breed: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Age in months'
  },
  gender: {
    type: DataTypes.ENUM('male', 'female', 'unknown'),
    allowNull: false,
  },
  size: {
    type: DataTypes.ENUM('small', 'medium', 'large', 'extra-large'),
    allowNull: true,
  },
  color: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  healthStatus: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  behavior: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  specialNeeds: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  specialNeedsDescription: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  houseTrained: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  goodWithKids: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  goodWithDogs: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  goodWithCats: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  microchipped: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  microchipId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  neutered: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  vaccinated: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  adoptionFee: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  adoptionStatus: {
    type: DataTypes.ENUM('available', 'pending', 'adopted', 'fostered', 'withdrawn'),
    defaultValue: 'available',
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'City/state where animal is located'
  },
  createdById: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  adoptedById: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  adoptionDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  }
}, {
  timestamps: true,
});

module.exports = Animal; 