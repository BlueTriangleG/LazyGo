import { Link } from 'expo-router'
import { Text, View } from 'react-native'

export default function Page() {
  return (
    <View>
      <Link href="/sign-in">
        <Text>Sign In</Text>
      </Link>
      <Link href="/sign-up">
        <Text>Sign Up</Text>
      </Link>
    </View>
  )
}
