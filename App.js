import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, View, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import UserScreen from './screens/UserScreen';
import Problem1Screen from './screens/Problem1Screen';
import Problem2Screen from './screens/Problem2Screen';
import Problem3Screen from './screens/Problem3Screen';
import PlanScreen from './screens/PlanScreen';
import SearchScreen from './screens/SearchScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// 加载页面
function LoadingScreen({ navigation }) {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace('Login');
    }, 2000); // 模拟加载过程，2秒后跳转到登录页面
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text>Loading...</Text>
    </View>
  );
}

// 底部导航栏
function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'User') {
            iconName = 'person';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="User" component={UserScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Loading">
        {/* 加载页面 */}
        <Stack.Screen name="Loading" component={LoadingScreen} options={{ headerShown: false }} />
        {/* 登录页面 */}
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        {/* 首页和用户页面带有底部导航栏 */}
        <Stack.Screen name="HomeTabs" component={HomeTabs} options={{ headerShown: false }} />
        {/* 问题页面导航 */}
        <Stack.Screen name="Problem1" component={Problem1Screen} />
        <Stack.Screen name="Problem2" component={Problem2Screen} />
        <Stack.Screen name="Problem3" component={Problem3Screen} />
        <Stack.Screen name="Plan" component={PlanScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

