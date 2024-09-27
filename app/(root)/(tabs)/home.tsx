import CustomButton from '@/components/CustomButton'
import { Link, router } from 'expo-router'
import { StyleSheet, Text, View } from 'react-native'
import { commonStyles } from '@/styles/common-styles'

export default function Page() {
  return (
    <View>
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
          router.replace('/(root)/(tabs)/gpt_test')
        }}
      />
    </View>
  )
}
