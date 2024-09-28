import { Tabs } from 'expo-router'
import { Image, ImageSourcePropType, View } from 'react-native'

import { icons } from '@/constants'

const TabIcon = ({
  source,
  focused,
}: {
  source: ImageSourcePropType
  focused: boolean
}) => (
  <View
    className={`flex flex-row justify-center items-center rounded-full ${focused ? 'bg-general-300' : ''}`}>
    <View
      className={`rounded-full w-12 h-12 items-center justify-center ${focused ? 'bg-general-400' : ''}`}>
      <Image
        source={source}
        tintColor="white"
        resizeMode="contain"
        className="w-7 h-7"
      />
    </View>
  </View>
)

export default function Layout() {
  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'white',
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#333333',
          paddingBottom: 0, // ios only
          overflow: 'hidden',
          height: 68,
          display: 'flex',
          justifyContent: 'space-between',
          //   alignItems: 'center',
          //   flexDirection: 'row',
          //   position: 'absolute',
        },
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon source={icons.home} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'history',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon source={icons.list} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="map-test"
        options={{
          title: 'map',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon source={icons.map} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon source={icons.profile} focused={focused} />
          ),
        }}
      />
    </Tabs>
  )
}
