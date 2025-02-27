import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';

const ProfileHeader = ({ user, onEditPress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.backgroundContainer}>
        <View style={styles.gradientOverlay} />
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          <TouchableOpacity style={styles.editAvatarButton} onPress={onEditPress}>
            <Icon name="camera" type="material-community" color="#fff" size={16} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.userInfo}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.memberSince}>Member since {user.memberSince}</Text>
          
          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <Icon name="email" type="material-community" color="#8e74ae" size={16} />
              <Text style={styles.detailText}>{user.email}</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Icon name="phone" type="material-community" color="#8e74ae" size={16} />
              <Text style={styles.detailText}>{user.phone}</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Icon name="map-marker" type="material-community" color="#8e74ae" size={16} />
              <Text style={styles.detailText}>{user.location}</Text>
            </View>
          </View>
        </View>
        
        <TouchableOpacity style={styles.editButton} onPress={onEditPress}>
          <Icon name="pencil" type="material-community" color="#8e74ae" size={18} />
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.planContainer}>
        <View style={styles.planInfoContainer}>
          <Text style={styles.planLabel}>Current Plan</Text>
          <Text style={styles.planName}>{user.plan}</Text>
        </View>
        <TouchableOpacity style={styles.upgradeButton}>
          <Text style={styles.upgradeButtonText}>Upgrade</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  backgroundContainer: {
    height: 150,
    backgroundColor: '#8e74ae',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginTop: -75,
  },
  avatarContainer: {
    position: 'relative',
    alignSelf: 'center',
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#fff',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#8e74ae',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 15,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  memberSince: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  detailsContainer: {
    width: '100%',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#444',
    marginLeft: 10,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: 'center',
  },
  editButtonText: {
    color: '#8e74ae',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  planContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f8f8',
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  planInfoContainer: {
    flex: 1,
  },
  planLabel: {
    fontSize: 12,
    color: '#666',
  },
  planName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  upgradeButton: {
    backgroundColor: '#8e74ae',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 15,
  },
  upgradeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ProfileHeader; 