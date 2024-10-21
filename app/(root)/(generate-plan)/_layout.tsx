import { Stack, useRouter } from 'expo-router' // 引入 useRouter 以便处理关闭按钮的导航
import { View, Image, TouchableOpacity, Text } from 'react-native'
import { icons } from '@/constants'
import React from 'react'
import { AnswerProvider } from './AnswerContext' // 引入 AnswerProvider

export default function Layout() {
  const router = useRouter() // 获取路由对象

  return (
    // 使用 AnswerProvider 包裹页面
    <AnswerProvider>
      <View className="flex-1">
        <Stack>
          <Stack.Screen name="gpt_test" />
          <Stack.Screen name="explore" options={{ headerShown: false }} />
          <Stack.Screen name="chat" options={{ headerShown: false }} />
        </Stack>
      </View>
    </AnswerProvider>
  )
}
