import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import {askAboutPlan, generatePlan, filterGoogleMapData, filterDestination} from '../../../lib/gpt-plan-generate'
import jsonData from '../../../data/restaurants.json'
const MyComponent = () => {
    const [text, setText] = useState(''); 
    const handleButtonPress = async () => {
        try {
            // TODO: write function for each use case to generate the request String
            const mapData = JSON.stringify(filterGoogleMapData(jsonData));
            const requestString = `${mapData}, it's 10 am now. You should reasonably manage only the breakfast, lunch, dinner and one small meal eating in cafe. If the current time exceed the meal time (breakfast:5 am - 10 am, lunch: before 11 am - 2 pm, afternoon tea: 2 pm - 4 pm, dinner: 5 pm - 11 pm), please ignore that meal.The plan should not have more than 4 meals a day.Give me a reasonable plan for a human being according to the rating and price level.`
            const result = await filterDestination(requestString)
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
