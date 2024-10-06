import React, { useState, useEffect } from 'react'; 
import { View, Text, Button, StyleSheet } from 'react-native';
import { generatePlan_restaurant, generatePlan_cafe, generatePlan_attractions } from '@/lib/gpt-plan-generate';
import { router } from 'expo-router';
import { generateDailyRecommends, RecommendDetail } from '@/lib/gpt-daily-recommend';
import * as Location from 'expo-location';
import ShakeDetector from '@/lib/shake';

const MyComponent = () => {
  const [text, setText] = useState('');

  const handleButtonPress = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      const location = `${loc.coords.latitude},${loc.coords.longitude}`;

      const now = new Date();
      const currentTime = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString();

      console.log(currentTime)
      const result = await generatePlan_restaurant(location, currentTime, "driving");
      console.log(JSON.stringify(result));
    } catch (error) {
      console.error("Error generating recommends:", error);
      setText("Failed to generate recommends.");
    }
  };

  return (
    <View style={styles.container}>
      <Button
        title="Generate Graph"
        onPress={() => router.push('/(root)/(generate-plan)/explore')}
      />
      <Text style={styles.text}>{text}</Text>
      <Button title="Generate Plan" onPress={handleButtonPress} />
      <ShakeDetector />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
    color: 'black',
  },
});

export default MyComponent;
