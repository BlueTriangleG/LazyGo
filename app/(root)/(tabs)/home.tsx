import CustomButton from '@/components/CustomButton'
import { Link, router } from 'expo-router'
import { StyleSheet, Text, View } from 'react-native'
import { commonStyles } from '@/styles/common-styles'
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Page() {
  const { user } = useUser()

  return (
    <SafeAreaView>
      <SignedIn>
        <Text style={commonStyles.h1text}>Welcome Lazy Go</Text>
        <CustomButton
          className="mt-6"
          title="Go to Map"
          onPress={async () => {
            router.replace('/(root)/(tabs)/map-test')
          }}
        />
        <CustomButton
          className="mt-6"
          title="generate plan"
          onPress={async () => {
            router.replace('/(root)/(generate-plan)/gpt_test')
          }}
        />
      </SignedIn>
      <SignedOut>
        <Link href="/(auth)/sign-in">
          <Text>Sign In</Text>
        </Link>
        <Link href="/(auth)/sign-up">
          <Text>Sign Up</Text>
        </Link>
      </SignedOut>
    </SafeAreaView>
  )
}
