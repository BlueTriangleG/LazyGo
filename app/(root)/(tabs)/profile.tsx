import { SafeAreaView } from 'react-native-safe-area-context'
import React from 'react'
import { Button, View, Text } from 'react-native'
import { useAuth } from '@clerk/clerk-expo'
import { router } from 'expo-router'
const Profile = () => {
  const { signOut } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/(auth)/welcome')
      // 可以在登出后执行其他逻辑，比如导航到登录页面
      console.log('Successfully signed out')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Are you sure you want to sign out?</Text>
      <Button title="Sign Out" onPress={handleSignOut} />
    </View>
  )
}
export default Profile
