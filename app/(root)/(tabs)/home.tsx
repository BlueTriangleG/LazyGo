import CustomButton from '@/components/CustomButton'
import { Link, router } from 'expo-router'
import {
  Text,
  View,
  ScrollView,
  Image,
  ImageBackground,
  TouchableOpacity,
} from 'react-native'
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { SafeAreaView } from 'react-native-safe-area-context'
import { icons, images } from '@/constants'

export default function Page() {
  const { user } = useUser()

  return (
    <ImageBackground
      source={require('../../../assets/images/background.png')}
      className="flex-1 w-full h-full"
      resizeMode="cover">
      <SafeAreaView className="flex-1">
        <ScrollView className="flex-1">
          <SignedIn>
            <Text className="font-JakartaBold text-left font-light my-1 px-2 self-start text-black">
              Address
            </Text>
            <View className="h-px bg-gray-300 my-1" />

            {/* 第一部分：图标部分 */}
            <View className="flex-1 justify-center items-center my-1">
              <View className="flex-row justify-around w-full px-5 ">
                {/* 图标容器 */}
                <View className="items-center">
                  <TouchableOpacity
                    onPress={() =>
                      router.push({
                        pathname: '/(root)/(generate-plan)/chat',
                        params: { placeType: 'restaurant' },
                      })
                    }>
                    <Image source={icons.restaurant} className="w-11 h-11" />
                  </TouchableOpacity>
                  <Text className="font-Jakarta font-light text-center my-1 text-xs">
                    Cafe
                  </Text>
                </View>
                <View className="items-center">
                  <TouchableOpacity
                    onPress={() =>
                      router.push({
                        pathname: '/(root)/(generate-plan)/chat',
                        params: { placeType: 'restaurant' },
                      })
                    }>
                    <Image source={icons.milkTea} className="w-11 h-11" />
                  </TouchableOpacity>
                  <Text className="font-Jakarta font-light text-center my-1 text-xs">
                    Milk tea
                  </Text>
                </View>

                <View className="items-center">
                  <TouchableOpacity
                    onPress={() =>
                      router.push({
                        pathname: '/(root)/(generate-plan)/chat',
                        params: { placeType: 'cafe' },
                      })
                    }>
                    <Image source={icons.coffee} className="w-11 h-11" />
                  </TouchableOpacity>
                  <Text className="font-Jakarta font-light text-center my-1 text-xs">
                    Cafe
                  </Text>
                </View>

                <View className="items-center">
                  <TouchableOpacity
                    onPress={() =>
                      router.push({
                        pathname: '/(root)/(generate-plan)/chat',
                        params: { placeType: 'entertainment' },
                      })
                    }>
                    <Image source={icons.entertainment} className="w-11 h-11" />
                  </TouchableOpacity>
                  <Text className="font-Jakarta font-light text-center my-1 text-xs">
                    Fun
                  </Text>
                </View>

                <View className="items-center">
                  <TouchableOpacity
                    onPress={() =>
                      router.push({
                        pathname: '/(root)/(generate-plan)/chat',
                        params: { placeType: 'attraction' },
                      })
                    }>
                    <Image source={icons.tour} className="w-11 h-11" />
                  </TouchableOpacity>
                  <Text className="font-Jakarta font-light text-center my-1 text-xs">
                    Tour
                  </Text>
                </View>
              </View>
            </View>

            <View className="h-px bg-gray-300 my-1" />

            {/* 第二部分：推荐部分 */}
            <View className="px-4 my-1">
              <Text className="font-JakartaBold text-left text-lg font-bold px-2 self-start text-black">
                Daily Recommends
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="pl-2 my-1">
                {/* 第一张卡片 */}
                <View className="w-[260px] mr-4 bg-white rounded-lg overflow-hidden shadow my-1">
                  <Image
                    source={require('../../../assets/images/home.png')}
                    className="w-full h-[260px]"
                    resizeMode="cover"
                  />
                  <Text className="text-xl font-bold p-2">ABC Restaurant</Text>
                  <Text className="text-base text-gray-600 px-2 pb-2">
                    517m - A great restaurant near you
                  </Text>
                </View>
                {/* 第二张卡片 */}
                <View className="w-[260px] mr-4 bg-white rounded-lg overflow-hidden shadow my-1">
                  <Image
                    source={require('../../../assets/images/yellow.png')}
                    className="w-full h-[260px]"
                    resizeMode="cover"
                  />
                  <Text className="text-xl font-bold p-2">NFC Museum</Text>
                  <Text className="text-base text-gray-600 px-2 pb-2">
                    5km - Famous museum in the area
                  </Text>
                </View>
                {/* 第三张卡片 */}
                <View className="w-[260px] mr-4 bg-white rounded-lg overflow-hidden shadow my-1">
                  <Image
                    source={require('../../../assets/images/background.png')}
                    className="w-full h-[260px]"
                    resizeMode="cover"
                  />
                  <Text className="text-xl font-bold p-2">XYZ Cafe</Text>
                  <Text className="text-base text-gray-600 px-2 pb-2">
                    1.2km - Cozy place for coffee
                  </Text>
                </View>
                {/* 第四张卡片 */}
                <View className="w-[260px] mr-4 bg-white rounded-lg overflow-hidden shadow my-1">
                  <Image
                    source={require('../../../assets/images/background.png')}
                    className="w-full h-[260px]"
                    resizeMode="cover"
                  />
                  <Text className="text-xl font-bold p-2">City Theatre</Text>
                  <Text className="text-base text-gray-600 px-2 pb-2">
                    2km - Popular movie spot
                  </Text>
                </View>
              </ScrollView>
            </View>

            <View className="h-px bg-gray-300 my-1" />

            {/* 第三部分：Tips部分，需要下滑才能看到 */}
            <View className="flex-1 px-4 my-1">
              <Text className="text-left text-2xl font-bold my-1 px-2 self-start text-black">
                Tips from Lazy Go
              </Text>
              <Text className="text-left text-base my-1 text-black">
                Hi! Good morning! Welcome to lazy go. Today is rainy, remember
                to bring your umbrella if you go out!
              </Text>
              <Text className="text-left text-base my-1 text-black">
                1. Bring umbrella
              </Text>
              <Text className="text-left text-base my-1 text-black">
                2. Go to ABC restaurant
              </Text>
              <Text className="text-left text-base my-1 text-black">
                3. Bring your ID card
              </Text>
            </View>

            <View className="h-px bg-gray-300 my-1" />

            <CustomButton
              className="mt-6 bg-red-300"
              title="Go to Map"
              onPress={async () => {
                router.push('/(root)/(tabs)/map-test')
              }}
            />
            <CustomButton
              className="mt-6 bg-red-300"
              title="Generate Plan"
              onPress={async () => {
                router.push('/(root)/(generate-plan)/gpt_test')
              }}
            />
            <CustomButton
              className="mt-6 bg-red-300"
              title="Travel Plan Test"
              onPress={async () => {
                router.push('/(root)/(generate-plan)/explore')
              }}
            />
          </SignedIn>
          <SignedOut>
            <Text>
              {/* 确保 Link 被包裹在 Text 中 */}
              <Link href="/(auth)/sign-in">Sign In</Link>
            </Text>
            <Text>
              {/* 确保 Link 被包裹在 Text 中 */}
              <Link href="/(auth)/sign-up">Sign Up</Link>
            </Text>
          </SignedOut>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  )
}
