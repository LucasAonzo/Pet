import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  FlatList, 
  TouchableOpacity,
  Image,
  StatusBar,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Icon } from 'react-native-elements';
import ConversationItem from '../components/chat/ConversationItem';
import MessageBubble from '../components/chat/MessageBubble';
import MessageInput from '../components/chat/MessageInput';
import { conversations, chatMessages } from '../data/chatData';

const ChatScreen = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState(chatMessages);

  // Handle sending a new message
  const handleSendMessage = (text) => {
    const newMessage = {
      id: `m${messages.length + 1}`,
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isFromUser: true,
    };
    
    setMessages([...messages, newMessage]);
  };

  // Handle opening a conversation
  const handleOpenConversation = (conversation) => {
    setSelectedConversation(conversation);
  };

  // Handle going back to conversation list
  const handleBackToList = () => {
    setSelectedConversation(null);
  };

  // Render the conversation list
  const renderConversationList = () => (
    <>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Icon name="magnify" type="material-community" color="#444" size={24} />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={conversations}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ConversationItem 
            conversation={item} 
            onPress={() => handleOpenConversation(item)} 
          />
        )}
      />
    </>
  );

  // Render the conversation detail
  const renderConversationDetail = () => (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.chatHeader}>
        <TouchableOpacity onPress={handleBackToList}>
          <Icon name="arrow-left" type="material-community" color="#444" size={24} />
        </TouchableOpacity>
        
        <View style={styles.chatHeaderInfo}>
          <Image source={{ uri: selectedConversation.avatar }} style={styles.chatAvatar} />
          <View>
            <Text style={styles.chatName}>{selectedConversation.name}</Text>
            <Text style={styles.chatRole}>{selectedConversation.role}</Text>
          </View>
        </View>
        
        <View style={styles.chatHeaderActions}>
          <TouchableOpacity style={styles.chatHeaderButton}>
            <Icon name="phone" type="material-community" color="#444" size={24} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.chatHeaderButton}>
            <Icon name="dots-vertical" type="material-community" color="#444" size={24} />
          </TouchableOpacity>
        </View>
      </View>
      
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <MessageBubble message={item} />}
        contentContainerStyle={styles.messagesContainer}
      />
      
      <MessageInput onSend={handleSendMessage} />
    </KeyboardAvoidingView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {selectedConversation ? renderConversationDetail() : renderConversationList()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  chatHeaderInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
  },
  chatAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  chatName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  chatRole: {
    fontSize: 12,
    color: '#8e74ae',
  },
  chatHeaderActions: {
    flexDirection: 'row',
  },
  chatHeaderButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  messagesContainer: {
    paddingVertical: 10,
  },
});

export default ChatScreen; 