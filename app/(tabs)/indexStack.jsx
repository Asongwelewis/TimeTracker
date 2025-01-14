import { View, Text, TextInput, StyleSheet, Image } from 'react-native';
import React, { useState } from 'react';


const Todolist = () => {
  const [searchText, setSearchText] = useState('');

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchBar}>
        {/* Search Icon */}
       
        {/* Search Input */}
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
        />
      </View>

      {/* TodoList Text */}
      <Text style={styles.text}>TodoList</Text>
    </View>
  );
};

export default Todolist;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'lightblue',
  },
  searchBar: {
    height: 40, // Adjusted height for better visibility
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginHorizontal: 10,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  text: {
    color: 'white',
    fontSize: 42,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: 'lightblue',
    marginTop: 20,
  },
});