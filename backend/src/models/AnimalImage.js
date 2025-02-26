const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const AnimalImage = sequelize.define('AnimalImage', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  animalId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Animals',
      key: 'id'
    }
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isPrimary: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  caption: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  }
}, {
  timestamps: true,
});

module.exports = AnimalImage; 