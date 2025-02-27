import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { animalService } from '../services/animalService';

/**
 * Hook for fetching all animals with optional filters
 * @param {Object} filters - Filters for the query
 * @param {Object} options - Additional react-query options
 * @returns {Object} - Query result object
 */
export const useAnimals = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: ['animals', filters],
    queryFn: () => animalService.getAll(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  });
};

/**
 * Hook for fetching a single animal by ID
 * @param {string|number} id - The animal ID
 * @param {Object} options - Additional react-query options
 * @returns {Object} - Query result object
 */
export const useAnimal = (id, options = {}) => {
  return useQuery({
    queryKey: ['animal', id],
    queryFn: () => animalService.getById(id),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!id, // Only run the query if we have an ID
    ...options,
  });
};

/**
 * Hook for creating a new animal
 * @returns {Object} - Mutation result object
 */
export const useCreateAnimal = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (animalData) => animalService.create(animalData),
    onSuccess: () => {
      // Invalidate the animals list query
      queryClient.invalidateQueries({ queryKey: ['animals'] });
    },
  });
};

/**
 * Hook for updating an animal
 * @returns {Object} - Mutation result object
 */
export const useUpdateAnimal = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, animalData }) => animalService.update(id, animalData),
    onSuccess: (data, variables) => {
      // Invalidate specific animal query and animals list
      queryClient.invalidateQueries({ queryKey: ['animal', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['animals'] });
    },
  });
};

/**
 * Hook for deleting an animal
 * @returns {Object} - Mutation result object
 */
export const useDeleteAnimal = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => animalService.delete(id),
    onSuccess: () => {
      // Invalidate animals list
      queryClient.invalidateQueries({ queryKey: ['animals'] });
    },
  });
};

/**
 * Hook for adding an image to an animal
 * @returns {Object} - Mutation result object
 */
export const useAddAnimalImage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ animalId, imageData }) => animalService.addImage(animalId, imageData),
    onSuccess: (data, variables) => {
      // Invalidate specific animal query
      queryClient.invalidateQueries({ queryKey: ['animal', variables.animalId] });
      queryClient.invalidateQueries({ queryKey: ['animals'] });
    },
  });
};

/**
 * Hook for deleting an image from an animal
 * @returns {Object} - Mutation result object
 */
export const useDeleteAnimalImage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ animalId, imageId }) => animalService.deleteImage(animalId, imageId),
    onSuccess: (data, variables) => {
      // Invalidate specific animal query
      queryClient.invalidateQueries({ queryKey: ['animal', variables.animalId] });
      queryClient.invalidateQueries({ queryKey: ['animals'] });
    },
  });
};

/**
 * Hook for fetching animals by user ID
 * @param {string} userId - The user ID (if not provided, uses the current user)
 * @param {Object} options - Additional react-query options
 * @returns {Object} - Query result object
 */
export const useUserAnimals = (userId = null, options = {}) => {
  return useQuery({
    queryKey: ['userAnimals', userId],
    queryFn: () => animalService.getByUserId(userId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  });
};

export default useAnimals; 