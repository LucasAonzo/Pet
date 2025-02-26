const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Adoption = sequelize.define('Adoption', {
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
  applicantId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected', 'withdrawn', 'completed'),
    defaultValue: 'pending',
  },
  applicationDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  homeType: {
    type: DataTypes.ENUM('house', 'apartment', 'condo', 'other'),
    allowNull: true,
  },
  hasYard: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  hasChildren: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  hasOtherPets: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  otherPetsDescription: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  petExperience: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  reasonForAdopting: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  hoursAlonePerDay: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  income: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  references: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  additionalInfo: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  reviewedBy: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  reviewDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  reviewNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  completionDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  timestamps: true,
});

module.exports = Adoption; 