import { Link, router } from 'expo-router'
import { useState } from 'react'
import { Alert, Image, ScrollView, Text, View } from 'react-native'
import { ReactNativeModal } from 'react-native-modal'

import CustomButton from '@/components/CustomButton'
import InputField from '@/components/InputField'
import { icons, images } from '@/constants'
import { fetchAPI } from '@/lib/fetch'
import { useSignUp } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { clerk } from '@clerk/clerk-expo/dist/provider/singleton'
import AsyncStorage from '@react-native-async-storage/async-storage'

const SignUp = () => {
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const { isLoaded, signUp, setActive } = useSignUp()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [verification, setVerification] = useState({
    state: 'default',
    error: '',
    code: '',
  })
  const onSignUpPress = async () => {
    if (!isLoaded) {
      return
    }

    try {
      await signUp.create({
        emailAddress: form.email,
        password: form.password,
      })

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      setVerification({ ...verification, state: 'pending' })
    } catch (err: any) {
      Alert.alert('Error', err.errors[0].longMessage)
    }
  }

  const onPressVerify = async () => {
    if (!isLoaded) return

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verification.code,
      })

      if (completeSignUp.status === 'complete') {
        // Create database user
        await fetchAPI('/(api)/user', {
          method: 'POST',
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            clerkId: completeSignUp.createdUserId,
          }),
        })
        await setActive({ session: completeSignUp.createdSessionId })
        setVerification({ ...verification, state: 'success' })
      } else {
        setVerification({
          ...verification,
          state: 'failed',
          error: 'Verification failed',
        })
      }
    } catch (err: any) {
      setVerification({
        ...verification,
        state: 'failed',
        error: err.errors[0].longmessage,
      })
    }
  }
  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="relative w-full h-[250px]">
          <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5">
            Create Your Account
          </Text>
        </View>
        <View className="p-5">
          <InputField
            label="Name"
            placeholder="Enter name"
            icon={icons.person}
            value={form.name}
            onChangeText={(value) => setForm({ ...form, name: value })}
          />
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
            title="Sign Up"
            className="mt-6 bg-red-300"
            onPress={onSignUpPress}
          />
          <Link
            href="/sign-in"
            className="text-lg text-center text-general-200 mt-10">
            Already have an account?{' '}
            <Text className="text-red-300">Log In</Text>
          </Link>
        </View>
        <ReactNativeModal
          isVisible={verification.state === 'pending'}
          // onBackdropPress={() =>
          //   setVerification({ ...verification, state: "default" })
          // }
          onModalHide={() => {
            if (verification.state === 'success') {
              setShowSuccessModal(true)
            }
          }}>
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Text className="font-JakartaExtraBold text-2xl mb-2">
              Verification
            </Text>
            <Text className="font-Jakarta mb-5">
              We've sent a verification code to {form.email}.
            </Text>
            <InputField
              label={'Code'}
              icon={icons.lock}
              placeholder={'12345'}
              value={verification.code}
              keyboardType="numeric"
              onChangeText={(code) =>
                setVerification({ ...verification, code })
              }
            />
            {verification.error && (
              <Text className="text-red-500 text-sm mt-1">
                {verification.error}
              </Text>
            )}
            <CustomButton
              onPress={onPressVerify}
              title="Verify Email"
              className="mt-5 bg-success-500"
            />
          </View>
        </ReactNativeModal>
        <ReactNativeModal isVisible={showSuccessModal}>
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Image
              source={images.check}
              className="w-[110px] h-[110px] mx-auto my-5"
            />
            <Text className="text-3xl font-JakartaBold text-center">
              Verified
            </Text>
            <Text className="text-base text-gray-400 font-Jakarta text-center mt-2">
              You have successfully verified your account.
            </Text>
            <CustomButton
              title="Browse Home"
              onPress={async () => {
                setShowSuccessModal(false)
                router.push(`/(root)/(tabs)/home`)
                await AsyncStorage.setItem('userEmail', form.email)
              }}
              className="mt-5"
            />
          </View>
        </ReactNativeModal>
      </View>
    </ScrollView>
  )
}
export default SignUp
