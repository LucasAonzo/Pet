import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  TouchableOpacity, 
  ScrollView,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { Icon } from 'react-native-elements';

const PetDetailScreen = ({ route, navigation }) => {
  const { pet } = route.params;
  const [isFavorite, setIsFavorite] = useState(pet.favorite);
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />
      
      {/* Pet Image */}
      <View style={styles.petDetailImageContainer}>
        <Image source={{ uri: pet.image }} style={styles.petDetailImage} />
        
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
        </View>
        
        {/* Location */}
        <View style={styles.petDetailLocation}>
          <Icon name="map-pin" type="feather" color="#8e74ae" size={20} />
          <Text style={styles.petDetailLocationText}>{pet.location} ({pet.distance})</Text>
        </View>
        
        {/* Pet Information Cards */}
        <View style={styles.petInfoCards}>
          <View style={styles.petInfoCard}>
            <Text style={styles.petInfoCardValue}>{pet.gender === 'male' ? 'Male' : 'Female'}</Text>
            <Text style={styles.petInfoCardLabel}>Sex</Text>
          </View>
          
          <View style={styles.petInfoCard}>
            <Text style={styles.petInfoCardValue}>Black</Text>
            <Text style={styles.petInfoCardLabel}>Color</Text>
          </View>
          
          <View style={styles.petInfoCard}>
            <Text style={styles.petInfoCardValue}>Persian</Text>
            <Text style={styles.petInfoCardLabel}>Breed</Text>
          </View>
          
          <View style={styles.petInfoCard}>
            <Text style={styles.petInfoCardValue}>2kg</Text>
            <Text style={styles.petInfoCardLabel}>Weight</Text>
          </View>
        </View>
        
        {/* Owner Information */}
        <View style={styles.ownerSection}>
          <View style={styles.ownerInfo}>
            <Image 
              source={{ uri: 'https://randomuser.me/api/portraits/women/32.jpg' }} 
              style={styles.ownerImage}
            />
            <View style={styles.ownerTextInfo}>
              <Text style={styles.ownerLabel}>Owner by:</Text>
              <Text style={styles.ownerName}>Steffani Wish</Text>
            </View>
          </View>
          
          <View style={styles.contactButtons}>
            <TouchableOpacity style={styles.contactButton}>
              <Icon name="phone" type="feather" color="#fff" size={24} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.contactButton}>
              <Icon name="message-square" type="feather" color="#fff" size={24} />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Description */}
        <View style={styles.descriptionSection}>
          <Text style={styles.descriptionText}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem pellentesque velit donec congue. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </Text>
        </View>
        
        {/* Adopt Button */}
        <TouchableOpacity style={styles.adoptButton}>
          <Text style={styles.adoptButtonText}>Adopt Me</Text>
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
  petInfoCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  petInfoCard: {
    width: '23%',
    backgroundColor: '#f9f9f9',
    borderRadius: 15,
    padding: 12,
    alignItems: 'center',
  },
  petInfoCardValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  petInfoCardLabel: {
    fontSize: 14,
    color: '#999',
  },
  ownerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  ownerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ownerImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  ownerTextInfo: {
    justifyContent: 'center',
  },
  ownerLabel: {
    fontSize: 14,
    color: '#999',
  },
  ownerName: {
    fontSize: 18,
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
    marginBottom: 30,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#999',
  },
  adoptButton: {
    backgroundColor: '#8e74ae',
    borderRadius: 15,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 30,
  },
  adoptButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default PetDetailScreen; 