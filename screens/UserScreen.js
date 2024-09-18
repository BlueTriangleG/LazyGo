import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';

export default function UserScreen() {
  // 用于保存用户填写的基本信息
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [isEditing, setIsEditing] = useState(true); // 用于控制是否在编辑模式

  const handleSave = () => {
    // 保存信息后退出编辑模式
    setIsEditing(false);
  };

  const handleEdit = () => {
    // 进入编辑模式
    setIsEditing(true);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>User Information</Text>

      {isEditing ? (
        <View>
          <TextInput
            placeholder="Name"
            value={name}
            onChangeText={setName}
            style={{ borderWidth: 1, width: 200, marginBottom: 10, padding: 5 }}
          />
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={{ borderWidth: 1, width: 200, marginBottom: 10, padding: 5 }}
          />
          <TextInput
            placeholder="Age"
            value={age}
            keyboardType="numeric"
            onChangeText={setAge}
            style={{ borderWidth: 1, width: 200, marginBottom: 10, padding: 5 }}
          />
          <Button title="Save" onPress={handleSave} />
        </View>
      ) : (
        <View>
          <Text style={{ marginBottom: 10 }}>Name: {name}</Text>
          <Text style={{ marginBottom: 10 }}>Email: {email}</Text>
          <Text style={{ marginBottom: 10 }}>Age: {age}</Text>
          <Button title="Edit" onPress={handleEdit} />
        </View>
      )}
    </View>
  );
}
