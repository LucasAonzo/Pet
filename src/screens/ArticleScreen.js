import React from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';

const ArticleScreen = () => (
  <SafeAreaView style={styles.container}>
    <View style={styles.centerScreen}>
      <Text>Article Screen</Text>
    </View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  centerScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ArticleScreen; 