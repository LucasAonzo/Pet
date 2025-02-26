import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';

const PetCard = ({ pet, onToggleFavorite, navigation }) => {
  return (
    <TouchableOpacity 
      style={styles.petCard}
      onPress={() => navigation.navigate('PetDetail', { pet })}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: pet.image }} style={styles.petImage} />
        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={() => onToggleFavorite(pet.id)}
        >
          <Icon 
            name={pet.favorite ? 'heart' : 'heart-outline'} 
            type="material-community" 
            color={pet.favorite ? '#e74c3c' : '#fff'} 
            size={20} 
          />
        </TouchableOpacity>
      </View>
      <View style={styles.petInfo}>
        <View style={styles.petHeader}>
          <Text style={styles.petName}>{pet.name}</Text>
          <View style={styles.genderContainer}>
            <Icon 
              name={pet.gender === 'male' ? 'gender-male' : 'gender-female'} 
              type="material-community" 
              color={pet.gender === 'male' ? '#3498db' : '#e84393'} 
              size={16} 
            />
          </View>
        </View>
        <View style={styles.locationContainer}>
          <Icon name="map-marker" type="material-community" color="#7f8c8d" size={14} />
          <Text style={styles.locationText}>{pet.location} • {pet.distance}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  petCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    width: '48%',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  imageContainer: {
    position: 'relative',
  },
  petImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  petInfo: {
    padding: 12,
  },
  petHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  petName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  genderContainer: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 12,
    color: '#7f8c8d',
    marginLeft: 4,
  },
});

export default PetCard; 