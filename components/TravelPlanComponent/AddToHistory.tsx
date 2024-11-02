import React, { useState } from 'react';
import { TouchableOpacity, Text, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type TravelData = {
  duration: string;
  destination: string;
  destinationDescrib: string;
  destinationDuration: string;
  transportation: string;
  distance: string;
  estimatedPrice: string;
  startLocation: string;
  endLocation: string;
};

type AddToHistoryProps = {
  travelData: TravelData;
  onClose: () => void; // 关闭函数
};

const AddToHistory: React.FC<AddToHistoryProps> = ({ travelData, onClose }) => {
  const [loading, setLoading] = useState(false); 

  const handleAddToHistory = async () => {
   
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleAddToHistory} disabled={loading}>
      {loading ? (
        <ActivityIndicator color="#fff" />  
      ) : (
        <Text style={styles.buttonText}>Save Plan</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#3f51b5',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default AddToHistory;
