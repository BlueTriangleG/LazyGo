import { Stack, useRouter } from 'expo-router' // 引入 useRouter 以便处理关闭按钮的导航
import { View, Image, TouchableOpacity } from 'react-native'
import { icons } from '@/constants'

export default function Layout() {
  const router = useRouter() // 获取路由对象

  return (
    <View className="flex-1">
      <TouchableOpacity
        className="absolute top-0 left-0 m-4"
        onPress={() => router.back()} // 使用 router.back() 返回上一页
      >
        <Image
          source={icons.profile}
          tintColor="white"
          resizeMode="contain"
          className="w-7 h-7"
        />
      </TouchableOpacity>
      <Stack>
        <Stack.Screen name="gpt_test" options={{ headerShown: false }} />
        <Stack.Screen name="explore" options={{ headerShown: false }} />
      </Stack>
    </View>
  )
}
