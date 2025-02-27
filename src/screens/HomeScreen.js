import React, { useState, useMemo, useCallback } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView, 
  StatusBar,
  RefreshControl
} from 'react-native';
import { Icon } from 'react-native-elements';
import AnimalList from '../components/AnimalList';
import { categoriesData, servicesData, plansData, nearbyCareData } from '../data/mockData';
import { useQueryClient } from '@tanstack/react-query';

const HomeScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const queryClient = useQueryClient();
  
  // Prepare filters for API request using useMemo for optimization
  const filters = useMemo(() => {
    const filterObj = {};
    
    if (selectedCategory !== 'all') {
      filterObj.species = selectedCategory;
    }
    
    if (searchText.trim()) {
      filterObj.search = searchText.trim();
    }
    
    return filterObj;
  }, [selectedCategory, searchText]);
  
  // Handle refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // Invalidate and refetch animals data
    await queryClient.invalidateQueries(['animals']);
    setRefreshing(false);
  }, [queryClient]);
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#8e74ae" />
      
      {/* Custom Header */}
      <SafeAreaView style={styles.safeAreaTop} />
      
      <View style={styles.customHeader}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Icon name="menu" type="material-community" color="#fff" size={26} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>AdoptMe</Text>
        
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.notificationContainer}>
            <Icon name="bell" type="material-community" color="#fff" size={24} />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image 
              source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }} 
              style={styles.profilePic}
            />
          </TouchableOpacity>
        </View>
      </View>
      
      <SafeAreaView style={styles.safeAreaContent}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 90 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#8e74ae']}
              tintColor="#8e74ae"
            />
          }
        >
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <TextInput
                placeholder="Search..."
                style={styles.searchInput}
                value={searchText}
                onChangeText={setSearchText}
              />
            </View>
            <TouchableOpacity style={styles.searchButton}>
              <Icon name="magnify" type="material-community" color="#fff" size={24} />
            </TouchableOpacity>
          </View>

          {/* Community Banner */}
          <View style={styles.bannerContainer}>
            <View style={styles.bannerContent}>
              <Text style={styles.bannerTitle}>Join our animal lovers Community</Text>
              <TouchableOpacity style={styles.joinButton}>
                <Text style={styles.joinButtonText}>Join Now</Text>
              </TouchableOpacity>
            </View>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' }} 
              style={styles.bannerImage}
            />
          </View>

          {/* Pet Categories Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pet Categories</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>More Category</Text>
            </TouchableOpacity>
          </View>

          {/* Categories List */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesContainer}
          >
            {categoriesData.map((category) => (
              <TouchableOpacity 
                key={category.id}
                style={[
                  styles.categoryItem, 
                  { backgroundColor: category.backgroundColor },
                  selectedCategory === category.id && styles.selectedCategory
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <View style={[styles.categoryIcon, { backgroundColor: category.iconBackground || category.backgroundColor }]}>
                  <Icon name={category.icon} type="material-community" color={category.color} size={24} />
                </View>
                <Text style={styles.categoryText}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Adopt Pet Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Adopt pet</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>

          {/* Pet Cards - Now using AnimalList instead of mock data */}
          <View style={styles.petsContainer}>
            <AnimalList
              navigation={navigation}
              filters={filters}
              onRefresh={onRefresh}
            />
          </View>

          {/* Services Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Services</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>

          {/* Services List */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.serviceContainer}
          >
            {servicesData.map((service) => (
              <TouchableOpacity 
                key={service.id}
                style={[styles.serviceItem, { backgroundColor: service.backgroundColor }]}
              >
                <View style={styles.serviceIconContainer}>
                  <Icon name={service.icon} type="material-community" color="#fff" size={24} />
                </View>
                <Text style={styles.serviceTitle}>{service.title}</Text>
                <Text style={styles.serviceDescription}>{service.description}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Plans Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Plans</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Compare plans</Text>
            </TouchableOpacity>
          </View>

          {/* Plans List */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.plansContainer}
          >
            {plansData.map((plan) => (
              <View 
                key={plan.id}
                style={[styles.planCard, { backgroundColor: plan.backgroundColor }]}
              >
                <Text style={styles.planTitle}>{plan.title}</Text>
                <Text style={styles.planPrice}>{plan.price}</Text>
                <View style={styles.featuresContainer}>
                  {plan.features.map((feature, index) => (
                    <View key={index} style={styles.featureItem}>
                      <Icon name="check" type="feather" color="#fff" size={16} />
                      <Text style={styles.featureText}>{feature}</Text>
                    </View>
                  ))}
                </View>
                <TouchableOpacity style={styles.planButton}>
                  <Text style={styles.planButtonText}>Select Plan</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          {/* Pet Care Nearby Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pet care nearby you</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>View map</Text>
            </TouchableOpacity>
          </View>

          {/* Nearby Care List */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.nearbyCareContainer}
          >
            {nearbyCareData.map((center) => (
              <TouchableOpacity 
                key={center.id}
                style={styles.careCenterCard}
              >
                <Image source={{ uri: center.image }} style={styles.careCenterImage} />
                <View style={styles.careCenterInfo}>
                  <Text style={styles.careCenterName}>{center.name}</Text>
                  <View style={styles.careCenterDetails}>
                    <View style={styles.ratingContainer}>
                      <Icon name="star" type="feather" color="#FFD700" size={16} />
                      <Text style={styles.ratingText}>{center.rating}</Text>
                    </View>
                    <View style={styles.distanceContainer}>
                      <Icon name="map-pin" type="feather" color="#8e74ae" size={16} />
                      <Text style={styles.distanceText}>{center.distance}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  safeAreaTop: {
    flex: 0,
    backgroundColor: '#8e74ae',
  },
  safeAreaContent: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: '#8e74ae',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationContainer: {
    marginRight: 15,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'red',
    borderWidth: 1,
    borderColor: '#fff',
  },
  profilePic: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    borderWidth: 2,
    borderColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: '#fff',
  },
  searchInputContainer: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 15,
    marginRight: 10,
    justifyContent: 'center',
  },
  searchInput: {
    fontSize: 16,
  },
  searchButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#8e74ae',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerContainer: {
    flexDirection: 'row',
    backgroundColor: '#8e74ae',
    borderRadius: 20,
    overflow: 'hidden',
    marginHorizontal: 20,
    height: 150,
    marginBottom: 25,
  },
  bannerContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  bannerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  joinButton: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignSelf: 'flex-start',
  },
  joinButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
  bannerImage: {
    width: '50%',
    height: '100%',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    color: '#8e74ae',
  },
  categoriesContainer: {
    paddingLeft: 15,
    marginBottom: 25,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 10,
    borderRadius: 25,
  },
  selectedCategory: {
    borderWidth: 2,
    borderColor: '#8e74ae',
  },
  categoryIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  categoryText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  petsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingBottom: 20,
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  serviceContainer: {
    paddingLeft: 15,
    marginBottom: 25,
  },
  serviceItem: {
    width: 160,
    height: 180,
    borderRadius: 20,
    padding: 15,
    marginRight: 15,
    justifyContent: 'space-between',
  },
  serviceIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  serviceDescription: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  plansContainer: {
    paddingLeft: 15,
    marginBottom: 25,
  },
  planCard: {
    width: 200,
    padding: 20,
    borderRadius: 20,
    marginRight: 15,
  },
  planTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  planPrice: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  featuresContainer: {
    marginBottom: 15,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 14,
  },
  planButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingVertical: 10,
    borderRadius: 15,
    alignItems: 'center',
  },
  planButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  nearbyCareContainer: {
    paddingLeft: 15,
    marginBottom: 25,
  },
  careCenterCard: {
    width: 220,
    marginRight: 15,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  careCenterImage: {
    width: '100%',
    height: 120,
  },
  careCenterInfo: {
    padding: 15,
  },
  careCenterName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  careCenterDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 5,
    color: '#666',
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceText: {
    marginLeft: 5,
    color: '#666',
  },
});

export default HomeScreen; 