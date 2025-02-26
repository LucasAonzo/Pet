const bcrypt = require('bcryptjs');
const { sequelize, User, Animal, AnimalImage, Vaccination, syncDatabase } = require('../models');
const { petsData, categoriesData } = require('../../../src/data/mockData');

/**
 * Initialize database with sample data
 */
const initializeDatabase = async () => {
  console.log('Starting database initialization...');
  
  try {
    // Force sync (drop tables if they exist)
    await syncDatabase({ force: true });
    console.log('Database tables created.');
    
    // Create admin user
    const adminUser = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@adoptme.com',
      password: await bcrypt.hash('admin123', 10),
      phone: '+1 (555) 123-4567',
      role: 'admin',
      city: 'San Francisco',
      state: 'CA',
    });
    console.log('Admin user created:', adminUser.email);
    
    // Create regular user
    const regularUser = await User.create({
      firstName: 'Emily',
      lastName: 'Johnson',
      email: 'emily@example.com',
      password: await bcrypt.hash('password123', 10),
      phone: '+1 (555) 987-6543',
      role: 'user',
      city: 'Portland',
      state: 'OR',
    });
    console.log('Regular user created:', regularUser.email);
    
    // Convert mock pet data to Animal models
    const animals = [];
    
    for (const pet of petsData) {
      // Map pet category to type
      const petType = pet.type;
      
      // Map type to species
      let species = 'other';
      if (['dog', 'cat', 'hamster'].includes(petType)) {
        species = petType;
      } else if (petType === 'turtle') {
        species = 'reptile';
      }
      
      // Parse age - extract number from "2 years" format
      let ageInMonths = 12; // default
      if (pet.age) {
        const ageMatch = pet.age.match(/(\d+)/);
        if (ageMatch) {
          const number = parseInt(ageMatch[1], 10);
          if (pet.age.includes('year')) {
            ageInMonths = number * 12;
          } else if (pet.age.includes('month')) {
            ageInMonths = number;
          }
        }
      }
      
      // Create animal
      const animal = await Animal.create({
        name: pet.name,
        species: species,
        breed: 'Mixed', // Default value
        gender: pet.gender,
        age: ageInMonths,
        size: 'medium', // Default value
        color: 'Various', // Default value
        description: `Meet ${pet.name}, a loving ${pet.gender === 'male' ? 'boy' : 'girl'} looking for a forever home.`,
        adoptionStatus: 'available',
        location: pet.location,
        createdById: adminUser.id,
        vaccinated: true,
        houseTrained: Math.random() > 0.5,
        goodWithKids: Math.random() > 0.5,
        goodWithDogs: Math.random() > 0.5,
        goodWithCats: Math.random() > 0.5,
        adoptionFee: Math.floor(Math.random() * 200) + 50, // Random fee between 50 and 250
      });
      
      // Add animal image
      await AnimalImage.create({
        animalId: animal.id,
        imageUrl: pet.image,
        isPrimary: true
      });
      
      // Add vaccinations
      if (species === 'dog') {
        await Vaccination.create({
          animalId: animal.id,
          name: 'Rabies',
          date: new Date(),
          nextDue: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
        });
        
        await Vaccination.create({
          animalId: animal.id,
          name: 'DHPP',
          date: new Date(),
          nextDue: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
        });
      } else if (species === 'cat') {
        await Vaccination.create({
          animalId: animal.id,
          name: 'Rabies',
          date: new Date(),
          nextDue: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
        });
        
        await Vaccination.create({
          animalId: animal.id,
          name: 'FVRCP',
          date: new Date(),
          nextDue: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
        });
      }
      
      animals.push(animal);
      console.log(`Animal created: ${animal.name} (${species})`);
    }
    
    console.log('Database initialization completed successfully.');
    
    return { adminUser, regularUser, animals };
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

// If script is run directly, execute the initialization
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log('Database initialization script completed.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Database initialization failed:', error);
      process.exit(1);
    });
}

module.exports = initializeDatabase; 