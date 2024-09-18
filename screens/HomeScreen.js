import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.addressText}>442 Elizabeth Street</Text>
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="gray" />
        <TextInput placeholder="what you want?" style={styles.searchInput} />
      </View>

      <View style={styles.iconRow}>
        <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('Problem1')}>
          <Ionicons name="restaurant" size={40} color="black" />
          <Text style={styles.iconText}>restaurant</Text>
        </TouchableOpacity>
        <View style={styles.emptyIconContainer}></View>
        <View style={styles.emptyIconContainer}></View>
        <View style={styles.emptyIconContainer}></View>
        <View style={styles.emptyIconContainer}></View>
      </View>

      <Text style={styles.sectionTitle}>Recommend for you!</Text>
      <View style={styles.placeholderBox}></View>

      <Text style={styles.sectionTitle}>Tips from Lazy Go</Text>
      <View style={styles.placeholderBox}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  addressText: {
    fontSize: 14,
    color: '#000',
  },
  timeText: {
    fontSize: 14,
    color: '#000',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 20,
  },
  searchInput: {
    marginLeft: 10,
    flex: 1,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  iconContainer: {
    alignItems: 'center',
  },
  emptyIconContainer: {
    width: 60,
    height: 60,
  },
  iconText: {
    marginTop: 5,
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  placeholderBox: {
    height: 100,
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    marginBottom: 20,
  },
});
