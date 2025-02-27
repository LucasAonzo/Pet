import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator } from 'react-native';
import supabase from '../services/supabaseWrapper';

/**
 * A component to test the Supabase connection
 */
const SupabaseTest = () => {
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    try {
      // A simple query to test the connection
      const { data, error } = await supabase.from('animals').select('count');
      
      if (error) {
        console.error('Supabase connection test failed:', error);
        setError(error.message);
      } else {
        console.log('Supabase connection test successful:', data);
        setTestResult(data);
      }
    } catch (err) {
      console.error('Supabase connection test error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Supabase Connection Test</Text>
      
      <Button 
        title="Test Connection" 
        onPress={testConnection} 
        disabled={loading}
      />
      
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8e74ae" />
          <Text style={styles.loadingText}>Testing connection...</Text>
        </View>
      )}
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Connection Error:</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      
      {testResult && !error && (
        <View style={styles.resultContainer}>
          <Text style={styles.successText}>Connection Successful!</Text>
          <Text style={styles.resultText}>
            {JSON.stringify(testResult, null, 2)}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  loadingContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  errorContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#ffebee',
    borderRadius: 5,
    borderLeftWidth: 5,
    borderLeftColor: '#d32f2f',
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginBottom: 5,
  },
  errorText: {
    color: '#333',
  },
  resultContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#e8f5e9',
    borderRadius: 5,
    borderLeftWidth: 5,
    borderLeftColor: '#4caf50',
  },
  successText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4caf50',
    marginBottom: 10,
  },
  resultText: {
    fontFamily: 'monospace',
    color: '#333',
  },
});

export default SupabaseTest; 