import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView 
} from 'react-native';
import { Icon } from 'react-native-elements';
import { userProfile } from '../../data/profileData';

const SideMenu = (props) => {
  const { navigation } = props;
  
  // Menu items structure
  const menuItems = [
    { id: 1, title: 'Home', icon: 'home', screen: 'Home' },
    { id: 2, title: 'My Pets', icon: 'paw', screen: 'Profile', params: { section: 'pets' } },
    { id: 3, title: 'Appointments', icon: 'calendar', screen: 'Profile', params: { section: 'appointments' } },
    { id: 4, title: 'My Orders', icon: 'shopping', screen: 'Profile', params: { section: 'orders' } },
    { id: 5, title: 'Favorites', icon: 'heart', screen: 'Profile', params: { section: 'favorites' } },
    { id: 6, title: 'Pet Care Plans', icon: 'shield-check', screen: 'Article' },
    { id: 7, title: 'Settings', icon: 'cog', screen: 'Profile', params: { section: 'settings' } },
    { id: 8, title: 'Help & Support', icon: 'help-circle', screen: 'Chat' },
  ];

  // Handle navigation to a specific screen
  const handleNavigation = (screen, params = {}) => {
    navigation.closeDrawer(); // Close the drawer first
    navigation.navigate(screen, params);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Removed header with back arrow */}

      {/* User Profile Section */}
      <View style={styles.profileSection}>
        <Image source={{ uri: userProfile.avatar }} style={styles.avatar} />
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{userProfile.name}</Text>
          <Text style={styles.profileEmail}>{userProfile.email}</Text>
          <TouchableOpacity 
            style={styles.viewProfileButton}
            onPress={() => handleNavigation('Profile')}
          >
            <Text style={styles.viewProfileText}>View Profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Menu Items */}
      <ScrollView style={styles.menuItems}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={() => handleNavigation(item.screen, item.params)}
          >
            <Icon
              name={item.icon}
              type="material-community"
              color="#444"
              size={24}
              style={styles.menuIcon}
            />
            <Text style={styles.menuTitle}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Sign Out Button */}
      <TouchableOpacity style={styles.signOutButton}>
        <Icon
          name="logout"
          type="material-community"
          color="#8e74ae"
          size={24}
          style={styles.menuIcon}
        />
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.version}>Version 1.0.0</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginTop: 15, // Added some margin at the top for better spacing
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
    marginBottom: 10,
  },
  viewProfileButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
    alignSelf: 'flex-start',
  },
  viewProfileText: {
    color: '#8e74ae',
    fontWeight: 'bold',
  },
  menuItems: {
    flex: 1,
    padding: 15,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuIcon: {
    marginRight: 15,
  },
  menuTitle: {
    fontSize: 16,
    color: '#333',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  signOutText: {
    fontSize: 16,
    color: '#8e74ae',
    fontWeight: 'bold',
  },
  footer: {
    padding: 15,
    alignItems: 'center',
  },
  version: {
    fontSize: 12,
    color: '#999',
  },
});

export default SideMenu; 