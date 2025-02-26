import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';

const MessageBubble = ({ message }) => {
  const { text, time, isFromUser, sender, avatar } = message;

  return (
    <View style={[styles.container, isFromUser ? styles.userContainer : styles.otherContainer]}>
      {!isFromUser && (
        <Image 
          source={{ uri: avatar }}
          style={styles.avatar}
        />
      )}
      
      <View style={[styles.bubbleWrapper, isFromUser ? styles.userBubbleWrapper : styles.otherBubbleWrapper]}>
        {!isFromUser && <Text style={styles.sender}>{sender}</Text>}
        
        <View style={[styles.bubble, isFromUser ? styles.userBubble : styles.otherBubble]}>
          <Text style={[styles.text, isFromUser ? styles.userText : styles.otherText]}>
            {text}
          </Text>
        </View>
        
        <Text style={styles.time}>{time}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    marginHorizontal: 15,
    flexDirection: 'row',
  },
  userContainer: {
    justifyContent: 'flex-end',
  },
  otherContainer: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
    alignSelf: 'flex-end',
    marginBottom: 5,
  },
  bubbleWrapper: {
    maxWidth: '80%',
  },
  userBubbleWrapper: {
    alignItems: 'flex-end',
  },
  otherBubbleWrapper: {
    alignItems: 'flex-start',
  },
  sender: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
    marginLeft: 5,
  },
  bubble: {
    borderRadius: 18,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 2,
  },
  userBubble: {
    backgroundColor: '#8e74ae',
  },
  otherBubble: {
    backgroundColor: '#f0f0f0',
  },
  text: {
    fontSize: 15,
  },
  userText: {
    color: '#fff',
  },
  otherText: {
    color: '#333',
  },
  time: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
    marginHorizontal: 5,
  },
});

export default MessageBubble; 