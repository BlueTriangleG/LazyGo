import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons' // 确保已安装 @expo/vector-icons

type HeaderProps = {
  onReset: () => void
}

const Header: React.FC<HeaderProps> = ({ onReset }) => {
  return (
    <View className="flex-row items-center justify-between p-4 h-14">
      <TouchableOpacity onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={20} color="black" />
      </TouchableOpacity>

      <Text className="text-base font-JakartaBold">Lazy Go</Text>

      <TouchableOpacity onPress={onReset}>
        <Ionicons name="refresh" size={20} color="black" />
      </TouchableOpacity>
    </View>
  )
}

export default Header
