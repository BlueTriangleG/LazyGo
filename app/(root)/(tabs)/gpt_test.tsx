import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import {askAboutPlan, generatePlan, filterGoogleMapData} from '../../../lib/gpt-plan-generate'
import jsonData from '../../../data/restaurants.json'
const MyComponent = () => {
    const [text, setText] = useState(''); 
    const handleButtonPress = async () => {
        try {
            // TODO: write function for each use case to generate the request String
            const mapData = JSON.stringify(filterGoogleMapData(jsonData));
            const requestString = `${mapData}, it's 10 am now. You should reasonably manage only the breakfast, lunch and dinner. If the current time exceed the meal time, please ignore that meal. You can add one afternoon tea in the afternoon. Give me a reasonable plan for a human being according to the rating and price level.`
            const result = await generatePlan(requestString)
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
