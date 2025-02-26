import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';

const MessageInput = ({ onSend }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSend(message.trim());
      setMessage('');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button}>
        <Icon name="plus" type="material-community" color="#8e74ae" size={24} />
      </TouchableOpacity>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="#999"
          value={message}
          onChangeText={setMessage}
          multiline
        />
      </View>
      
      <TouchableOpacity style={styles.button}>
        <Icon name="camera" type="material-community" color="#8e74ae" size={24} />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.button, styles.sendButton, !message.trim() && styles.disabledButton]}
        onPress={handleSend}
        disabled={!message.trim()}
      >
        <Icon 
          name="send" 
          type="material-community" 
          color={message.trim() ? "#fff" : "#ccc"} 
          size={20} 
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  inputContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginHorizontal: 5,
    maxHeight: 120,
  },
  input: {
    fontSize: 16,
    color: '#333',
    paddingVertical: 10,
  },
  sendButton: {
    backgroundColor: '#8e74ae',
  },
  disabledButton: {
    backgroundColor: '#f0f0f0',
  },
});

export default MessageInput; 