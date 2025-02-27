import supabase from './supabaseWrapper';

/**
 * Animal Service - Provides functions to interact with the animals table in Supabase
 */
export const animalService = {
  /**
   * Get all animals with optional filters
   * @param {Object} filters - Filters for the query
   * @returns {Promise} - Promise with the query result
   */
  getAll: async (filters = {}) => {
    // Start building the query
    let query = supabase
      .from('animals')
      .select(`
        *,
        animal_images (*)
      `);
    
    // Apply filters
    if (filters.species) {
      query = query.eq('species', filters.species);
    }
    
    if (filters.breed) {
      query = query.ilike('breed', `%${filters.breed}%`);
    }
    
    if (filters.gender) {
      query = query.eq('gender', filters.gender);
    }
    
    if (filters.ageMin) {
      query = query.gte('age', filters.ageMin);
    }
    
    if (filters.ageMax) {
      query = query.lte('age', filters.ageMax);
    }
    
    if (filters.size) {
      query = query.eq('size', filters.size);
    }
    
    if (filters.adoptionStatus) {
      query = query.eq('adoption_status', filters.adoptionStatus);
    }
    
    if (filters.goodWithKids === true) {
      query = query.eq('good_with_kids', true);
    }
    
    if (filters.goodWithDogs === true) {
      query = query.eq('good_with_dogs', true);
    }
    
    if (filters.goodWithCats === true) {
      query = query.eq('good_with_cats', true);
    }
    
    if (filters.location) {
      query = query.ilike('location', `%${filters.location}%`);
    }
    
    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%, breed.ilike.%${filters.search}%, description.ilike.%${filters.search}%`);
    }
    
    // Execute the query
    const { data, error, count } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Map the data to match the format expected by the frontend
    const animals = data.map(animal => {
      // Process animal_images to match the expected format
      const AnimalImages = animal.animal_images?.map(img => ({
        id: img.id,
        imageUrl: img.image_url,
        isPrimary: img.is_primary,
        caption: img.caption,
        order: img.order
      })) || [];
      
      return {
        id: animal.id,
        name: animal.name,
        species: animal.species,
        breed: animal.breed,
        age: animal.age,
        gender: animal.gender,
        size: animal.size,
        color: animal.color,
        description: animal.description,
        adoptionStatus: animal.adoption_status,
        goodWithKids: animal.good_with_kids,
        goodWithDogs: animal.good_with_dogs,
        goodWithCats: animal.good_with_cats,
        location: animal.location,
        AnimalImages
      };
    });
    
    return {
      success: true,
      count: animals.length,
      totalPages: 1,
      currentPage: 1,
      animals
    };
  },
  
  /**
   * Get a single animal by ID
   * @param {string|number} id - The animal ID
   * @returns {Promise} - Promise with the animal data
   */
  getById: async (id) => {
    const { data: animal, error } = await supabase
      .from('animals')
      .select(`
        *,
        animal_images (*),
        vaccinations (*),
        profiles:user_id (*)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    // Format animal_images to match the expected format
    const images = animal.animal_images?.map(img => ({
      id: img.id,
      imageUrl: img.image_url,
      isPrimary: img.is_primary,
      caption: img.caption,
      order: img.order
    })) || [];
    
    // Format vaccinations to match the expected format
    const vaccinations = animal.vaccinations?.map(vac => ({
      id: vac.id,
      name: vac.name,
      date: vac.date,
      expirationDate: vac.expiration_date,
      veterinarian: vac.veterinarian
    })) || [];
    
    // Get user profile information
    let userProfile = null;
    if (animal.user_id) {
      // If profiles join didn't work, try to fetch the profile directly
      if (!animal.profiles) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', animal.user_id)
          .single();
          
        if (profileData) {
          userProfile = {
            id: profileData.id,
            firstName: profileData.first_name,
            lastName: profileData.last_name,
            avatarUrl: profileData.avatar_url,
            phoneNumber: profileData.phone_number,
            role: profileData.role || 'user'
          };
        }
      } else {
        userProfile = {
          id: animal.profiles.id,
          firstName: animal.profiles.first_name,
          lastName: animal.profiles.last_name,
          avatarUrl: animal.profiles.avatar_url,
          phoneNumber: animal.profiles.phone_number,
          role: animal.profiles.role || 'user'
        };
      }
    }
    
    // Format the animal to match the expected format
    const formattedAnimal = {
      id: animal.id,
      name: animal.name,
      species: animal.species,
      breed: animal.breed,
      age: animal.age,
      gender: animal.gender,
      size: animal.size,
      color: animal.color,
      description: animal.description,
      healthStatus: animal.health_status,
      behavior: animal.behavior,
      specialNeeds: animal.special_needs,
      specialNeedsDescription: animal.special_needs_description,
      houseTrained: animal.house_trained,
      goodWithKids: animal.good_with_kids,
      goodWithDogs: animal.good_with_dogs,
      goodWithCats: animal.good_with_cats,
      microchipped: animal.microchipped,
      microchipId: animal.microchip_id,
      neutered: animal.neutered,
      vaccinated: animal.vaccinated,
      adoptionFee: animal.adoption_fee,
      location: animal.location,
      adoptionStatus: animal.adoption_status,
      createdAt: animal.created_at,
      updatedAt: animal.updated_at,
      userId: animal.user_id,
      userProfile,
      images,
      vaccinations
    };
    
    return {
      success: true,
      animal: formattedAnimal
    };
  },
  
  /**
   * Create a new animal
   * @param {Object} animalData - The animal data
   * @returns {Promise} - Promise with the created animal
   */
  create: async (animalData) => {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) throw userError;
    
    if (!user) {
      throw new Error('You must be logged in to create an animal');
    }
    
    // Format the data to match Supabase schema (snake_case)
    const formattedData = {
      name: animalData.name,
      species: animalData.species,
      breed: animalData.breed,
      age: animalData.age,
      gender: animalData.gender,
      size: animalData.size,
      color: animalData.color,
      description: animalData.description,
      health_status: animalData.healthStatus,
      behavior: animalData.behavior,
      special_needs: animalData.specialNeeds,
      special_needs_description: animalData.specialNeedsDescription,
      house_trained: animalData.houseTrained,
      good_with_kids: animalData.goodWithKids,
      good_with_dogs: animalData.goodWithDogs,
      good_with_cats: animalData.goodWithCats,
      microchipped: animalData.microchipped,
      microchip_id: animalData.microchipId,
      neutered: animalData.neutered,
      vaccinated: animalData.vaccinated,
      adoption_fee: animalData.adoptionFee,
      location: animalData.location,
      adoption_status: animalData.adoptionStatus || 'available',
      user_id: user.id,
    };
    
    const { data, error } = await supabase
      .from('animals')
      .insert(formattedData)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      success: true,
      message: 'Animal created successfully',
      animal: data
    };
  },
  
  /**
   * Update an animal
   * @param {string|number} id - The animal ID
   * @param {Object} animalData - The updated animal data
   * @returns {Promise} - Promise with the updated animal
   */
  update: async (id, animalData) => {
    // Format the data to match Supabase schema (snake_case)
    const formattedData = {};
    
    if (animalData.name) formattedData.name = animalData.name;
    if (animalData.species) formattedData.species = animalData.species;
    if (animalData.breed) formattedData.breed = animalData.breed;
    if (animalData.age !== undefined) formattedData.age = animalData.age;
    if (animalData.gender) formattedData.gender = animalData.gender;
    if (animalData.size) formattedData.size = animalData.size;
    if (animalData.color) formattedData.color = animalData.color;
    if (animalData.description) formattedData.description = animalData.description;
    if (animalData.healthStatus) formattedData.health_status = animalData.healthStatus;
    if (animalData.behavior) formattedData.behavior = animalData.behavior;
    if (animalData.specialNeeds !== undefined) formattedData.special_needs = animalData.specialNeeds;
    if (animalData.specialNeedsDescription) formattedData.special_needs_description = animalData.specialNeedsDescription;
    if (animalData.houseTrained !== undefined) formattedData.house_trained = animalData.houseTrained;
    if (animalData.goodWithKids !== undefined) formattedData.good_with_kids = animalData.goodWithKids;
    if (animalData.goodWithDogs !== undefined) formattedData.good_with_dogs = animalData.goodWithDogs;
    if (animalData.goodWithCats !== undefined) formattedData.good_with_cats = animalData.goodWithCats;
    if (animalData.microchipped !== undefined) formattedData.microchipped = animalData.microchipped;
    if (animalData.microchipId) formattedData.microchip_id = animalData.microchipId;
    if (animalData.neutered !== undefined) formattedData.neutered = animalData.neutered;
    if (animalData.vaccinated !== undefined) formattedData.vaccinated = animalData.vaccinated;
    if (animalData.adoptionFee !== undefined) formattedData.adoption_fee = animalData.adoptionFee;
    if (animalData.location) formattedData.location = animalData.location;
    if (animalData.adoptionStatus) formattedData.adoption_status = animalData.adoptionStatus;
    
    const { data, error } = await supabase
      .from('animals')
      .update(formattedData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      success: true,
      message: 'Animal updated successfully',
      animal: data
    };
  },
  
  /**
   * Delete an animal
   * @param {string|number} id - The animal ID
   * @returns {Promise} - Promise with the operation result
   */
  delete: async (id) => {
    const { error } = await supabase
      .from('animals')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return {
      success: true,
      message: 'Animal deleted successfully'
    };
  },
  
  /**
   * Add an image to an animal
   * @param {string|number} animalId - The animal ID
   * @param {Object} imageData - The image data
   * @returns {Promise} - Promise with the operation result
   */
  addImage: async (animalId, imageData) => {
    // Format the data to match Supabase schema (snake_case)
    const formattedData = {
      animal_id: animalId,
      image_url: imageData.imageUrl,
      is_primary: imageData.isPrimary || false,
      caption: imageData.caption || null,
      order: imageData.order || 0
    };
    
    // If setting as primary, update existing primary images
    if (formattedData.is_primary) {
      await supabase
        .from('animal_images')
        .update({ is_primary: false })
        .eq('animal_id', animalId)
        .eq('is_primary', true);
    }
    
    const { data, error } = await supabase
      .from('animal_images')
      .insert(formattedData)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      success: true,
      message: 'Image added successfully',
      image: {
        id: data.id,
        animalId: data.animal_id,
        imageUrl: data.image_url,
        isPrimary: data.is_primary,
        caption: data.caption,
        order: data.order
      }
    };
  },
  
  /**
   * Delete an image from an animal
   * @param {string|number} animalId - The animal ID
   * @param {string|number} imageId - The image ID
   * @returns {Promise} - Promise with the operation result
   */
  deleteImage: async (animalId, imageId) => {
    // First check if this is a primary image
    const { data: image, error: fetchError } = await supabase
      .from('animal_images')
      .select('is_primary')
      .eq('id', imageId)
      .eq('animal_id', animalId)
      .single();
    
    if (fetchError) throw fetchError;
    
    // Delete the image
    const { error: deleteError } = await supabase
      .from('animal_images')
      .delete()
      .eq('id', imageId)
      .eq('animal_id', animalId);
    
    if (deleteError) throw deleteError;
    
    // If it was a primary image, make another image primary
    if (image.is_primary) {
      const { data: remainingImages, error: remainingError } = await supabase
        .from('animal_images')
        .select('id')
        .eq('animal_id', animalId)
        .limit(1);
      
      if (remainingError) throw remainingError;
      
      if (remainingImages.length > 0) {
        const { error: updateError } = await supabase
          .from('animal_images')
          .update({ is_primary: true })
          .eq('id', remainingImages[0].id);
        
        if (updateError) throw updateError;
      }
    }
    
    return {
      success: true,
      message: 'Image removed successfully'
    };
  },
  
  /**
   * Get animals by user ID
   * @param {string} userId - The user ID (if not provided, uses the current user)
   * @returns {Promise} - Promise with the user's animals
   */
  getByUserId: async (userId = null) => {
    // If no userId is provided, get the current user
    let userIdToUse = userId;
    
    if (!userIdToUse) {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      
      if (!user) {
        throw new Error('You must be logged in to view your animals');
      }
      
      userIdToUse = user.id;
    }
    
    // Get animals by user ID
    const { data: animals, error } = await supabase
      .from('animals')
      .select(`
        *,
        animal_images (*)
      `)
      .eq('user_id', userIdToUse)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Format the animals to match the expected format
    const formattedAnimals = animals.map(animal => {
      // Format animal_images to match the expected format
      const AnimalImages = animal.animal_images?.map(img => ({
        id: img.id,
        imageUrl: img.image_url,
        isPrimary: img.is_primary,
        caption: img.caption,
        order: img.order
      })) || [];
      
      return {
        id: animal.id,
        name: animal.name,
        species: animal.species,
        breed: animal.breed,
        age: animal.age,
        gender: animal.gender,
        size: animal.size,
        color: animal.color,
        description: animal.description,
        healthStatus: animal.health_status,
        behavior: animal.behavior,
        specialNeeds: animal.special_needs,
        specialNeedsDescription: animal.special_needs_description,
        houseTrained: animal.house_trained,
        goodWithKids: animal.good_with_kids,
        goodWithDogs: animal.good_with_dogs,
        goodWithCats: animal.good_with_cats,
        microchipped: animal.microchipped,
        microchipId: animal.microchip_id,
        neutered: animal.neutered,
        vaccinated: animal.vaccinated,
        adoptionFee: animal.adoption_fee,
        location: animal.location,
        adoptionStatus: animal.adoption_status,
        createdAt: animal.created_at,
        updatedAt: animal.updated_at,
        AnimalImages
      };
    });
    
    return {
      success: true,
      count: animals.length,
      animals: formattedAnimals
    };
  }
};

export default animalService;

/**
 * Test Supabase connection
 * @returns {Promise} Promise that resolves with connection test result
 */
export const testSupabaseConnection = async () => {
  try {
    // A simple query to test connection
    const { data, error } = await supabase.from('animals').select('count');
    
    if (error) {
      console.error('Supabase connection test failed:', error);
      return { success: false, error };
    }
    
    console.log('Supabase connection test successful:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Supabase connection test error:', error);
    return { success: false, error };
  }
};

/**
 * Get all animals with optional filtering
 * @param {Object} filters - Optional filters for the query
 * @returns {Promise} Promise that resolves with the animals data
 */
export const getAnimals = async (filters = {}) => {
  try {
    let query = supabase.from('animals').select('*');
    
    // Apply filters if provided
    if (filters.category) {
      query = query.eq('category', filters.category);
    }
    
    if (filters.searchText) {
      query = query.ilike('name', `%${filters.searchText}%`);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching animals:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getAnimals:', error);
    throw error;
  }
};

/**
 * Get a single animal by ID
 * @param {string} id - The animal ID
 * @returns {Promise} Promise that resolves with the animal data
 */
export const getAnimalById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('animals')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching animal with ID ${id}:`, error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getAnimalById:', error);
    throw error;
  }
}; 