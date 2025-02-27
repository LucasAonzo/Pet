// Import polyfills first
import './src/utils/polyfills';
import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Icon } from 'react-native-elements';
import { enableScreens } from 'react-native-screens';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Import screens from their respective files
import HomeScreen from './src/screens/HomeScreen';
import ArticleScreen from './src/screens/ArticleScreen';
import ChatScreen from './src/screens/ChatScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import PetDetailScreen from './src/screens/PetDetailScreen';

// Import custom drawer content
import SideMenu from './src/components/layout/SideMenu';

// Enable screens for better performance
enableScreens();

// Create the tab navigator, stack navigator, and drawer navigator
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// Create a client
const queryClient = new QueryClient();

// Home Stack Navigator
const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeScreen" component={HomeScreen} />
    <Stack.Screen name="PetDetail" component={PetDetailScreen} />
  </Stack.Navigator>
);

// Tab Navigator
const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route, navigation }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Home') {
          iconName = 'home';
        } else if (route.name === 'Article') {
          iconName = 'newspaper';
        } else if (route.name === 'Chat') {
          iconName = 'chat';
        } else if (route.name === 'Profile') {
          iconName = 'account';
        }

        return <Icon name={iconName} type="material-community" size={size} color={color} />;
      },
      tabBarActiveTintColor: '#8e74ae',
      tabBarInactiveTintColor: 'gray',
      tabBarShowLabel: true,
      tabBarStyle: {
        height: 90,
        paddingBottom: 30,
        paddingTop: 10,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        elevation: 10,
        shadowOpacity: 0.1,
        shadowRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
      },
      tabBarLabelStyle: {
        fontSize: 12,
        marginTop: 2,
        marginBottom: 8,
      },
      tabBarIconStyle: {
        marginTop: 6,
      },
      headerShown: true,
      headerStyle: {
        backgroundColor: '#fff',
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
      },
      headerTitleStyle: {
        color: '#8e74ae',
        fontSize: 18,
        fontWeight: 'bold',
      },
      headerTitleAlign: 'center',
      headerLeft: () => (
        <Icon
          name="menu"
          type="material-community"
          size={26}
          color="#8e74ae"
          containerStyle={{ marginLeft: 15 }}
          onPress={() => navigation.openDrawer()}
        />
      ),
    })}
  >
    <Tab.Screen 
      name="Home" 
      component={HomeStack} 
      options={{ 
        headerShown: false 
      }}
    />
    <Tab.Screen 
      name="Article" 
      component={ArticleScreen} 
      options={{ headerTitle: 'Articles' }}
    />
    <Tab.Screen 
      name="Chat" 
      component={ChatScreen} 
      options={{ headerTitle: 'Chat' }}
    />
    <Tab.Screen 
      name="Profile" 
      component={ProfileScreen} 
      options={{ headerTitle: 'My Profile' }}
    />
  </Tab.Navigator>
);

// Main App Component with Navigation
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <NavigationContainer>
            <Drawer.Navigator
              drawerContent={(props) => <SideMenu {...props} />}
              screenOptions={{
                drawerStyle: {
                  width: '80%',
                  backgroundColor: '#fff',
                },
                drawerType: 'front',
                overlayColor: 'rgba(0,0,0,0.6)',
                swipeEnabled: true,
                headerShown: false,
              }}
            >
              <Drawer.Screen name="Main" component={TabNavigator} />
            </Drawer.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}

// Only keep common styles used across the app
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  centerScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
