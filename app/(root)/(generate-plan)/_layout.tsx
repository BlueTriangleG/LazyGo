import { Stack } from 'expo-router'

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="gpt_test" options={{ headerShown: false }} />
    </Stack>
  )
}
