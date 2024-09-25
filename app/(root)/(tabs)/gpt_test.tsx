import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import {askAboutPlan, generatePlan} from '../../../lib/gpt-plan-generate'
const MyComponent = () => {
    const [text, setText] = useState(''); 
    const handleButtonPress = async () => {
        try {
            const result = await askAboutPlan(`{"plan":{"day1":{"activities":[{"time":"08:00","duration":"5","destination":"Cafe A","destination describ":"A cozy cafe with great coffee","destination duration":"60"},{"time":"10:00","duration":"10","destination":"Cafe B","destination describ":"Popular spot known for 
pastries","destination duration":"45"}]},"reply":"This plan includes visits to two cafes in the morning, starting with Cafe A followed by Cafe B."}, How long I will take staying Cafe A`); 
            if (result) { 
                setText(result);
            } else {
                setText("No plan generated"); 
            }
        } catch (error) {
            console.error("Error generating plan:", error);
            setText("Failed to generate plan.");
        }
    };



    return (
        <View style={styles.container}>
            <Text style={styles.text}>{text}</Text>
            <Button title="Generate Plan" onPress={handleButtonPress} />
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
