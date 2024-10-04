import React, { useState } from 'react'
import { View, Text, Button, StyleSheet } from 'react-native'
import {generatePlan_restaurant,generatePlan_cafe, generatePlan_attractions} from '@/lib/gpt-plan-generate'
import { router } from 'expo-router'
import { generateDailyRecommends } from '@/lib/gpt-daily-recommend'
const MyComponent = () => {
  const [text, setText] = useState('')
  const handleButtonPress = async () => {
    try {
        // TODO: write function for each use case to generate the request String
        // const result = await generatePlan("restaurant", "2024-9-29T10:00:00Z",1)
        // const resultString = JSON.stringify(result)
        // console.log(resultString)

        // const result = await generatePlan_attractions("-37.8136,144.9631","2024-09-29T23:00:00Z", "driving");
        const result = await generateDailyRecommends("-37.8136,144.9631")
        console.log(JSON.stringify(result));
        // console.log(result)
        // if (result) { 
        //     setText(result);
        // } else {
        //     setText("No plan generated"); 
        // }
    } catch (error) {
        console.error("Error generating plan:", error);
        setText("Failed to generate plan.");
    }
};

  return (
    <View style={styles.container}>
      <Button title="Back" onPress={() => router.push('/(root)/(tabs)/home')} />
      <Button
        title="generate graph"
        onPress={() => router.push('/(root)/(generate-plan)/explore')}
      />
      <Text style={styles.text}>{text}</Text>
      <Button title="Generate Plan" onPress={handleButtonPress} />
    </View>
  )
}

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
})

export default MyComponent
