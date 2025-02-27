import React from 'react';
import { 
  StyleSheet, 
  View, 
  FlatList, 
  ActivityIndicator, 
  Text,
  RefreshControl,
  TouchableOpacity,
  Image
} from 'react-native';
import PetCard from './PetCard';
import { useAnimals } from '../hooks/useAnimals';
import { Icon } from 'react-native-elements';

const AnimalList = ({ navigation, filters = {}, onRefresh }) => {
  // Use the custom React Query hook
  const { 
    data, 
    isLoading, 
    isError, 
    error, 
    refetch, 
    isRefetching 
  } = useAnimals(filters, {
    // If parent passes onRefresh function, use it when refetching completes
    onSuccess: () => {
      if (onRefresh) onRefresh();
    }
  });

  // Transform the data to match the PetCard component expectations
  const animals = data?.animals?.map(animal => ({
    id: animal.id,
    name: animal.name,
    image: animal.AnimalImages && animal.AnimalImages.length > 0 
      ? animal.AnimalImages[0].imageUrl 
      : 'https://via.placeholder.com/300x300?text=No+Image',
    gender: animal.gender,
    type: animal.species,
    breed: animal.breed,
    age: animal.age,
    location: animal.location || 'Unknown location',
    distance: 'Unknown',
    favorite: false
  })) || [];

  // Handle toggle favorite
  const handleToggleFavorite = (petId) => {
    // In the future, we'll implement this with React Query mutations
    // For now, just update the UI
    // We would need server support to save favorites in the database
  };
  
  // Handle pull-to-refresh
  const handleRefresh = () => {
    refetch();
  };

  if (isLoading && !isRefetching) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#8e74ae" />
        <Text style={styles.loadingText}>Loading animals...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centeredContainer}>
        <Icon name="wifi-off" type="material-community" color="#d32f2f" size={50} />
        <Text style={styles.errorText}>
          {error?.message?.includes('Network') 
            ? 'Network connection error. Check your internet connection.'
            : error?.message || 'Failed to load animals. Please try again later.'}
        </Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => refetch()}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (animals.length === 0) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.noResultsText}>No animals found matching your criteria.</Text>
      </View>
    );
  }

  // Instead of using FlatList with columns, render directly in a way that matches the HomeScreen UI
  return (
    <View style={styles.petsContainer}>
      {animals.map(animal => (
        <PetCard 
          key={animal.id} 
          pet={animal} 
          onToggleFavorite={handleToggleFavorite}
          navigation={navigation}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 200, // Add minimum height for better appearance
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
    marginVertical: 10,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  noResultsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  petsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  retryButton: {
    backgroundColor: '#8e74ae',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 15,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  }
});

export default AnimalList; 