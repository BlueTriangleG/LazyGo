import React, { useState } from 'react'
import { View, Text, Button, StyleSheet } from 'react-native'
import { generatePlan } from '@/lib/gpt-plan-generate'
import { Link, router } from 'expo-router'
import { Image, TouchableOpacity } from 'react-native'
import { icons } from '@/constants'

const MyComponent = () => {
  const [text, setText] = useState('')
  const handleButtonPress = async () => {
    try {
      const result = await generatePlan(
        'I want to eat something, there are Cafe A and Cafe B around me'
      )
      if (result) {
        setText(result)
      } else {
        setText('No plan generated')
      }
    } catch (error) {
      console.error('Error generating plan:', error)
      setText('Failed to generate plan.')
    }
  }

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
