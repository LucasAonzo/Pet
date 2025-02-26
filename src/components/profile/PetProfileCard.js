import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';

const PetProfileCard = ({ pet, onPress, onEditPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={{ uri: pet.image }} style={styles.image} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{pet.name}</Text>
          <TouchableOpacity onPress={onEditPress}>
            <Icon name="pencil" type="material-community" color="#8e74ae" size={20} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Icon name="paw" type="material-community" color="#8e74ae" size={16} />
            <Text style={styles.detailText}>{pet.breed}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Icon name="calendar" type="material-community" color="#8e74ae" size={16} />
            <Text style={styles.detailText}>{pet.age}</Text>
          </View>
        </View>
        
        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Icon name="microchip" type="material-community" color="#8e74ae" size={16} />
            <Text style={styles.detailText}>{pet.microchipId}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Icon name="calendar-heart" type="material-community" color="#8e74ae" size={16} />
            <Text style={styles.detailText}>Since {pet.adoptionDate}</Text>
          </View>
        </View>
        
        <View style={styles.vaccinationsContainer}>
          <Text style={styles.vaccinationTitle}>Vaccinations</Text>
          
          {pet.vaccinations.map((vaccine, index) => (
            <View key={index} style={styles.vaccinationItem}>
              <View style={styles.vaccinationInfo}>
                <Icon name="needle" type="material-community" color="#8e74ae" size={14} />
                <Text style={styles.vaccinationName}>{vaccine.name}</Text>
              </View>
              <View style={styles.vaccinationDates}>
                <Text style={styles.vaccinationDate}>{vaccine.date}</Text>
                <Icon name="arrow-right" type="material-community" color="#ccc" size={12} />
                <Text style={styles.nextDueDate}>{vaccine.nextDue}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: 180,
  },
  content: {
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 5,
  },
  vaccinationsContainer: {
    marginTop: 10,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  vaccinationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  vaccinationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  vaccinationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vaccinationName: {
    fontSize: 14,
    color: '#555',
    marginLeft: 5,
  },
  vaccinationDates: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vaccinationDate: {
    fontSize: 12,
    color: '#888',
  },
  nextDueDate: {
    fontSize: 12,
    color: '#ff8c00',
  },
});

export default PetProfileCard; 