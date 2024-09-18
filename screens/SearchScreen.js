import React from 'react';
import { View, Text, TextInput } from 'react-native';

export default function SearchScreen({ route }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Your Plan with Search Result</Text>
      <TextInput placeholder="Your question..." style={{ width: 300, height: 50, borderWidth: 1 }} />
      <TextInput placeholder="Response..." style={{ width: 300, height: 100, borderWidth: 1 }} multiline />
    </View>
  );
}
