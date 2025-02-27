import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  TouchableOpacity, 
  ScrollView,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { Icon } from 'react-native-elements';
import { useAnimal } from '../hooks/useAnimals';

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2; // 2 cards per row with margins

const PetDetailScreen = ({ route, navigation }) => {
  // Get animal ID from route params
  const petId = route.params?.pet?.id;
  const initialPetData = route.params?.pet;
  
  // Fetch detailed animal data with React Query
  const { data, isLoading, isError } = useAnimal(petId, {
    // Use initial data from route params while fetching fresh data
    initialData: initialPetData ? { animal: initialPetData } : undefined
  });
  
  const [isFavorite, setIsFavorite] = useState(initialPetData?.favorite || false);
  
  // Show loading state if data is loading and no initial data
  if (isLoading && !initialPetData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8e74ae" />
        <Text style={styles.loadingText}>Loading pet details...</Text>
      </View>
    );
  }
  
  // Show error state
  if (isError) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="alert-circle" type="feather" color="red" size={50} />
        <Text style={styles.errorText}>Failed to load pet details</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  // Use the most up-to-date data (from query or initialData)
  const pet = data?.animal || initialPetData;
  
  // Get primary image URL or first available image
  const primaryImage = pet.images?.find(img => img.isPrimary) || pet.images?.[0];
  const imageUrl = primaryImage?.imageUrl || 
                  pet.AnimalImages?.[0]?.imageUrl || 
                  'https://via.placeholder.com/300x300?text=No+Image';
  
  // Format shelter/user name
  const shelterName = pet.userProfile ? 
    `${pet.userProfile.firstName || ''} ${pet.userProfile.lastName || ''}`.trim() || 'Unknown Shelter' :
    'AdoptMe Shelter';
  
  // Get avatar URL
  const avatarUrl = pet.userProfile?.avatarUrl || 'https://randomuser.me/api/portraits/women/32.jpg';
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />
      
      {/* Pet Image */}
      <View style={styles.petDetailImageContainer}>
        <Image source={{ uri: imageUrl }} style={styles.petDetailImage} />
        
        {/* Header Buttons */}
        <View style={styles.detailHeaderButtons}>
          <TouchableOpacity 
            style={styles.detailHeaderButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-left" type="feather" color="#444" size={24} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.detailHeaderButton}
            onPress={() => setIsFavorite(!isFavorite)}
          >
            <Icon name="heart" type="feather" color={isFavorite ? 'red' : '#e0e0e0'} size={24} />
          </TouchableOpacity>
        </View>
        
        {/* Bottom Indicator */}
        <View style={styles.detailImageIndicator} />
      </View>
      
      <ScrollView style={styles.petDetailContent}>
        {/* Pet Name */}
        <View style={styles.petDetailHeader}>
          <Text style={styles.petDetailName}>{pet.name}</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{pet.adoptionStatus || 'Available'}</Text>
          </View>
        </View>
        
        {/* Location */}
        <View style={styles.petDetailLocation}>
          <Icon name="map-pin" type="feather" color="#8e74ae" size={20} />
          <Text style={styles.petDetailLocationText}>{pet.location || 'Unknown location'}</Text>
        </View>
        
        {/* Pet Information Cards - Reorganized into 2x2 grid */}
        <View style={styles.petInfoCardsContainer}>
          <View style={styles.petInfoCardRow}>
            <View style={styles.petInfoCard}>
              <Text style={styles.petInfoCardValue}>{pet.gender === 'male' ? 'Male' : 'Female'}</Text>
              <Text style={styles.petInfoCardLabel}>Sex</Text>
            </View>
            
            <View style={styles.petInfoCard}>
              <Text style={styles.petInfoCardValue}>{pet.color || 'Unknown'}</Text>
              <Text style={styles.petInfoCardLabel}>Color</Text>
            </View>
          </View>
          
          <View style={styles.petInfoCardRow}>
            <View style={styles.petInfoCard}>
              <Text style={styles.petInfoCardValue}>{pet.breed || 'Unknown'}</Text>
              <Text style={styles.petInfoCardLabel}>Breed</Text>
            </View>
            
            <View style={styles.petInfoCard}>
              <Text style={styles.petInfoCardValue}>{pet.age} {pet.age === 1 ? 'year' : 'years'}</Text>
              <Text style={styles.petInfoCardLabel}>Age</Text>
            </View>
          </View>
        </View>
        
        {/* Owner Information - Using data from Supabase */}
        <View style={styles.ownerSection}>
          <View style={styles.ownerInfo}>
            <Image 
              source={{ uri: avatarUrl }} 
              style={styles.ownerImage}
            />
            <View style={styles.ownerTextInfo}>
              <Text style={styles.ownerLabel}>Shelter:</Text>
              <Text style={styles.ownerName}>{shelterName}</Text>
            </View>
          </View>
          
          <View style={styles.contactButtons}>
            {pet.userProfile?.phoneNumber && (
              <TouchableOpacity style={styles.contactButton}>
                <Icon name="phone" type="feather" color="#fff" size={24} />
              </TouchableOpacity>
            )}
            
            <TouchableOpacity style={styles.contactButton}>
              <Icon name="message-square" type="feather" color="#fff" size={24} />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Description */}
        <View style={styles.descriptionSection}>
          <Text style={styles.descriptionTitle}>About {pet.name}</Text>
          {pet.description ? (
            <Text style={styles.descriptionText}>{pet.description}</Text>
          ) : (
            <Text style={styles.noDescriptionText}>
              No description available for this pet. Please contact the shelter for more information.
            </Text>
          )}
        </View>
        
        {/* Health Information */}
        {(pet.healthStatus || pet.vaccinated || pet.neutered || pet.microchipped) && (
          <View style={styles.healthSection}>
            <Text style={styles.sectionTitle}>Health Information</Text>
            <View style={styles.healthGrid}>
              {pet.healthStatus && (
                <View style={styles.healthItem}>
                  <Icon name="activity" type="feather" color="#8e74ae" size={20} />
                  <Text style={styles.healthItemText}>Health: {pet.healthStatus}</Text>
                </View>
              )}
              
              {pet.vaccinated !== undefined && (
                <View style={styles.healthItem}>
                  <Icon name="check-circle" type="feather" color={pet.vaccinated ? "#4CAF50" : "#9e9e9e"} size={20} />
                  <Text style={styles.healthItemText}>Vaccinated: {pet.vaccinated ? 'Yes' : 'No'}</Text>
                </View>
              )}
              
              {pet.neutered !== undefined && (
                <View style={styles.healthItem}>
                  <Icon name="check-circle" type="feather" color={pet.neutered ? "#4CAF50" : "#9e9e9e"} size={20} />
                  <Text style={styles.healthItemText}>Neutered: {pet.neutered ? 'Yes' : 'No'}</Text>
                </View>
              )}
              
              {pet.microchipped !== undefined && (
                <View style={styles.healthItem}>
                  <Icon name="check-circle" type="feather" color={pet.microchipped ? "#4CAF50" : "#9e9e9e"} size={20} />
                  <Text style={styles.healthItemText}>Microchipped: {pet.microchipped ? 'Yes' : 'No'}</Text>
                </View>
              )}
            </View>
          </View>
        )}
        
        {/* Additional Pet Information */}
        {pet.specialNeeds && (
          <View style={styles.additionalInfo}>
            <Text style={styles.additionalInfoTitle}>Special Needs</Text>
            <Text style={styles.additionalInfoText}>
              {pet.specialNeedsDescription || 'This pet has special needs. Please contact the shelter for more information.'}
            </Text>
          </View>
        )}
        
        {/* Compatibility Information */}
        <View style={styles.compatibilitySection}>
          <Text style={styles.compatibilityTitle}>Compatibility</Text>
          <View style={styles.compatibilityIcons}>
            <View style={styles.compatibilityItem}>
              <Icon 
                name="human-male-boy" 
                type="material-community" 
                color={pet.goodWithKids ? '#4CAF50' : '#9e9e9e'} 
                size={28} 
              />
              <Text style={[styles.compatibilityText, {color: pet.goodWithKids ? '#4CAF50' : '#9e9e9e'}]}>Kids</Text>
            </View>
            
            <View style={styles.compatibilityItem}>
              <Icon 
                name="dog" 
                type="material-community" 
                color={pet.goodWithDogs ? '#4CAF50' : '#9e9e9e'} 
                size={28} 
              />
              <Text style={[styles.compatibilityText, {color: pet.goodWithDogs ? '#4CAF50' : '#9e9e9e'}]}>Dogs</Text>
            </View>
            
            <View style={styles.compatibilityItem}>
              <Icon 
                name="cat" 
                type="material-community" 
                color={pet.goodWithCats ? '#4CAF50' : '#9e9e9e'} 
                size={28} 
              />
              <Text style={[styles.compatibilityText, {color: pet.goodWithCats ? '#4CAF50' : '#9e9e9e'}]}>Cats</Text>
            </View>
          </View>
        </View>
        
        {/* Adopt Button */}
        <TouchableOpacity 
          style={[
            styles.adoptButton, 
            pet.adoptionStatus !== 'available' ? styles.adoptButtonDisabled : {}
          ]}
          disabled={pet.adoptionStatus !== 'available'}
        >
          <Text style={styles.adoptButtonText}>
            {pet.adoptionStatus === 'available' ? 'Adopt Me' : 'Not Available'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  errorText: {
    marginTop: 15,
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
  backButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 25,
    backgroundColor: '#8e74ae',
    borderRadius: 25,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  petDetailImageContainer: {
    position: 'relative',
    width: '100%',
    height: 350,
  },
  petDetailImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  detailHeaderButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  detailHeaderButton: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  detailImageIndicator: {
    position: 'absolute',
    bottom: 15,
    alignSelf: 'center',
    width: 50,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#fff',
  },
  petDetailContent: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    paddingHorizontal: 25,
    paddingTop: 30,
  },
  petDetailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  petDetailName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    backgroundColor: '#8e74ae',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  petDetailLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  petDetailLocationText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
  petInfoCardsContainer: {
    marginBottom: 25,
  },
  petInfoCardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  petInfoCard: {
    width: cardWidth,
    backgroundColor: '#f8f8f8',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  petInfoCardValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    textAlign: 'center',
  },
  petInfoCardLabel: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  ownerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
    marginBottom: 25,
  },
  ownerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ownerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  ownerTextInfo: {
    marginLeft: 15,
  },
  ownerLabel: {
    fontSize: 14,
    color: '#888',
  },
  ownerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  contactButtons: {
    flexDirection: 'row',
  },
  contactButton: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: '#8e74ae',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  descriptionSection: {
    marginBottom: 25,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
  },
  noDescriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#999',
    fontStyle: 'italic',
  },
  healthSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  healthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  healthItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 12,
  },
  healthItemText: {
    marginLeft: 8,
    fontSize: 15,
    color: '#666',
  },
  additionalInfo: {
    marginBottom: 25,
    backgroundColor: '#f9f5ff',
    padding: 15,
    borderRadius: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#8e74ae',
  },
  additionalInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  additionalInfoText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
  },
  compatibilitySection: {
    marginBottom: 25,
  },
  compatibilityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  compatibilityIcons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  compatibilityItem: {
    alignItems: 'center',
  },
  compatibilityText: {
    marginTop: 5,
    fontSize: 14,
  },
  adoptButton: {
    backgroundColor: '#8e74ae',
    borderRadius: 30,
    padding: 18,
    alignItems: 'center',
    marginBottom: 30,
  },
  adoptButtonDisabled: {
    backgroundColor: '#d1c4e9',
  },
  adoptButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default PetDetailScreen; 