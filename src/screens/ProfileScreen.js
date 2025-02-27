import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity,
  StatusBar,
  FlatList,
  Image
} from 'react-native';
import { Icon } from 'react-native-elements';
import ProfileHeader from '../components/profile/ProfileHeader';
import PetProfileCard from '../components/profile/PetProfileCard';
import { userProfile, userPets } from '../data/profileData';
import SupabaseTest from '../components/SupabaseTest';

const ProfileScreen = () => {
  const [activeTab, setActiveTab] = useState('pets');

  // Render the tabs for different sections
  const renderTabs = () => (
    <View style={styles.tabsContainer}>
      <TouchableOpacity 
        style={[styles.tab, activeTab === 'pets' && styles.activeTab]} 
        onPress={() => setActiveTab('pets')}
      >
        <Text style={[styles.tabText, activeTab === 'pets' && styles.activeTabText]}>My Pets</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.tab, activeTab === 'appointments' && styles.activeTab]} 
        onPress={() => setActiveTab('appointments')}
      >
        <Text style={[styles.tabText, activeTab === 'appointments' && styles.activeTabText]}>Appointments</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.tab, activeTab === 'orders' && styles.activeTab]} 
        onPress={() => setActiveTab('orders')}
      >
        <Text style={[styles.tabText, activeTab === 'orders' && styles.activeTabText]}>Orders</Text>
      </TouchableOpacity>
    </View>
  );

  // Handle pet card press
  const handlePetCardPress = (pet) => {
    console.log('Pet card pressed:', pet.name);
    // In a real app, navigate to detailed pet profile
  };

  // Handle edit button press on pet card
  const handleEditPetPress = (pet) => {
    console.log('Edit pet pressed:', pet.name);
    // In a real app, open edit pet form
  };

  // Render the pets section
  const renderPetsSection = () => (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>My Pets</Text>
        <TouchableOpacity style={styles.addButton}>
          <Icon name="plus" type="material-community" color="#fff" size={16} />
          <Text style={styles.addButtonText}>Add Pet</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={userPets}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <PetProfileCard 
            pet={item} 
            onPress={() => handlePetCardPress(item)}
            onEditPress={() => handleEditPetPress(item)}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );

  // Render the appointments section
  const renderAppointmentsSection = () => (
    <View style={styles.sectionContainer}>
      <View style={styles.emptyStateContainer}>
        <Icon name="calendar-clock" type="material-community" color="#8e74ae" size={60} />
        <Text style={styles.emptyStateTitle}>No Upcoming Appointments</Text>
        <Text style={styles.emptyStateText}>
          Schedule check-ups, grooming sessions, or training for your pets
        </Text>
        <TouchableOpacity style={styles.emptyStateButton}>
          <Text style={styles.emptyStateButtonText}>Schedule Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Render the orders section
  const renderOrdersSection = () => (
    <View style={styles.sectionContainer}>
      <View style={styles.emptyStateContainer}>
        <Icon name="shopping" type="material-community" color="#8e74ae" size={60} />
        <Text style={styles.emptyStateTitle}>No Recent Orders</Text>
        <Text style={styles.emptyStateText}>
          Shop for food, toys, accessories, and more for your pets
        </Text>
        <TouchableOpacity style={styles.emptyStateButton}>
          <Text style={styles.emptyStateButtonText}>Shop Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Render the active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'pets':
        return renderPetsSection();
      case 'appointments':
        return renderAppointmentsSection();
      case 'orders':
        return renderOrdersSection();
      default:
        return renderPetsSection();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <ProfileHeader user={userProfile} />
        {renderTabs()}
        {renderTabContent()}

        {/* Supabase Connection Test Section */}
        <SupabaseTest />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollView: {
    flex: 1,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  tab: {
    paddingVertical: 15,
    marginRight: 20,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#8e74ae',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#888',
  },
  activeTabText: {
    color: '#8e74ae',
    fontWeight: '600',
  },
  sectionContainer: {
    flex: 1,
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#8e74ae',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 30,
    marginBottom: 20,
  },
  emptyStateButton: {
    backgroundColor: '#8e74ae',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  emptyStateButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default ProfileScreen; 