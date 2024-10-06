import { Link, useRouter } from 'expo-router'
import { useCallback, useState } from 'react'
import { Alert, Image, ScrollView, Text, View } from 'react-native'
import React from 'react'
import { useSignIn } from '@clerk/clerk-expo'

import CustomButton from '@/components/CustomButton'
import InputField from '@/components/InputField'
import { icons, images } from '@/constants'

import AsyncStorage from '@react-native-async-storage/async-storage';

const SignIn = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
  })
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()

  const onSignInPress = useCallback(async () => {
    if (!isLoaded) {
      return
    }

    try {
      const signInAttempt = await signIn.create({
        identifier: form.email,
        password: form.password,
      })

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })

        // store email here
        await AsyncStorage.setItem('userEmail', form.email);

        router.replace('/')
      } else {
        // See https://clerk.com/docs/custom-flows/error-handling
        // for more info on error handling
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err: any) {
      Alert.alert('Error', err.errors[0].longMessage)
    }
  }, [isLoaded, form.email, form.password])
  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="relative w-full h-[250px]">
          <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5">
            Welcome 👋
          </Text>
        </View>

        <View className="p-5">
          <InputField
            label="Email"
            placeholder="Enter email"
            icon={icons.email}
            textContentType="emailAddress"
            value={form.email}
            onChangeText={(value) => setForm({ ...form, email: value })}
          />

          <InputField
            label="Password"
            placeholder="Enter password"
            icon={icons.lock}
            secureTextEntry={true}
            textContentType="password"
            value={form.password}
            onChangeText={(value) => setForm({ ...form, password: value })}
          />
          <CustomButton
            title="Sign In"
            onPress={onSignInPress}
            className="mt-6 bg-red-300"
          />

          <Link
            href="/sign-up"
            className="text-lg text-center text-general-200 mt-10">
            Don't have an account? <Text className="text-red-300">Sign Up</Text>
          </Link>
        </View>
      </View>
    </ScrollView>
  )
}

export default SignIn
