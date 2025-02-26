# Pet Adoption App

A React Native mobile application for pet adoption, built with Expo.

## Features

- Browse pets by category (cats, dogs, turtles, hamsters)
- View detailed information about each pet
- Save favorite pets
- Chat with pet owners
- View adoption articles
- User profile management

## Project Structure

```
/Pet
  /src
    /components
      - PetCard.js        # Reusable pet card component
    /screens
      - HomeScreen.js     # Main screen with pet listings and categories
      - PetDetailScreen.js # Detailed view of a single pet
      - ArticleScreen.js  # Screen for articles about pet adoption
      - ChatScreen.js     # Chat functionality
      - ProfileScreen.js  # User profile management
    /data
      - mockData.js       # Mock data for pets and categories
  - App.js                # Main application entry point
  - package.json          # Dependencies
```

## Technologies Used

- React Native
- Expo
- React Navigation
- React Native Elements
- React Native Gesture Handler
- React Native Safe Area Context
- React Native Screens

## Getting Started

### Prerequisites

- Node.js
- npm or yarn
- Expo CLI

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npx expo start
   ```
4. Use the Expo Go app on your mobile device to scan the QR code or run on an emulator.

## Navigation

The app uses React Navigation with a combination of:
- Bottom Tab Navigator for the main screens (Home, Article, Chat, Profile)
- Stack Navigator for navigating from HomeScreen to PetDetailScreen

## Styling

The app uses a consistent color scheme with primary colors:
- Primary: #8e74ae (Purple)
- Secondary background colors for categories
- Clean white backgrounds with subtle shadows for cards
- Safe area considerations for iOS and Android

## Credits

Pet images sourced from Unsplash. 