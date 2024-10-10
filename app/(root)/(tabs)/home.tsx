import CustomButton from '@/components/CustomButton'
import { Link, router } from 'expo-router'
import { StyleSheet, Text, View, ScrollView, ImageBackground} from 'react-native'
import { commonStyles } from '@/styles/common-styles'
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FontAwesome } from '@expo/vector-icons'

export default function Page() {
  const { user } = useUser()

  return (
    <ImageBackground 
      source={require('../../../assets/images/background.png')}
      style={styles.background} 
      resizeMode="cover"
    >
      <SafeAreaView>
        <ScrollView style={styles.contentWrapper}>
          <SignedIn>
            <Text style={commonStyles.h1text}>Welcome Lazy Go!</Text>

            <View style={styles.separator} />

            {/* Search bar and icon navigation section */}
            <View style={styles.searchContainer}>
              <Text style={styles.searchText}>What you want?</Text>
              <View style={styles.iconRow}>
                {/* 图标和标签 */}
                <View style={styles.iconContainer}>
                  <View style={[styles.iconWrapper, { backgroundColor: '#FFCDD2' }]}>
                    <FontAwesome name="cutlery" size={40} color="black" onPress={() => router.push({pathname: '/(root)/(generate-plan)/chat', params: {placeType: "restaurant"}})} />
                  </View>
                  <Text style={styles.iconLabel}>Restaurant</Text> 
                </View>
                <View style={styles.iconContainer}>
                  <View style={[styles.iconWrapper, { backgroundColor: '#C8E6C9' }]}>
                    <FontAwesome name="coffee" size={40} color="black" onPress={() => router.push({pathname: '/(root)/(generate-plan)/chat', params: {placeType: "cafe"}})} />
                  </View>
                  <Text style={styles.iconLabel}>Cafe</Text> 
                </View>
                <View style={styles.iconContainer}>
                  <View style={[styles.iconWrapper, { backgroundColor: '#BBDEFB' }]}>
                    <FontAwesome name="university" size={40} color="black" onPress={() => router.push({pathname: '/(root)/(generate-plan)/chat', params: {placeType: "entertainment"}})} />
                  </View>
                  <Text style={styles.iconLabel}>Entertainment</Text> 
                </View>
                <View style={styles.iconContainer}>
                  <View style={[styles.iconWrapper, { backgroundColor: '#FFE082' }]}>
                    <FontAwesome name="film" size={40} color="black" onPress={() => router.push({pathname: '/(root)/(generate-plan)/chat', params: {placeType: "attraction"}})} />
                  </View>
                  <Text style={styles.iconLabel}>Tour</Text> 
                </View>
              </View>
            </View>

            <View style={styles.separator} />

            {/* Recommendation section */}
            <View style={styles.recommendSection}>
              <Text style={commonStyles.h1text}>Recommend for you</Text>
              {/* 修改为横向布局 */}
              <View style={styles.recommendRow}>
                <View style={styles.recommendBox}>
                  <Text>ABC restaurant</Text>
                  <Text>332 abc street - 517m</Text>
                  <Text>A great restaurant with over 1000 people rank 5 star for them. Close to you and have a coffee to begin your wonderful new day</Text>
                </View>
                <View style={styles.recommendBox}>
                  <Text>NFC museum</Text>
                  <Text>4421 abc street - 5km</Text>
                  <Text>A great museum with over 1000 people rank 5 star for them. Close to you</Text>
                </View>
              </View>
            </View>

            <View style={styles.separator} />

            {/* Tips */}
            <View style={styles.tipsSection}>
              <Text style={commonStyles.h1text}>Tips from Lazy Go</Text>
              <Text>Hi! Good morning! Welcome to lazy go. Today is rainy, remember to bring your umbrella if you go out!</Text>
              <Text>1. Bring umbrella</Text>
              <Text>2. Go to ABC restaurant</Text>
              <Text>3. Bring your ID card</Text>
            </View>

            <View style={styles.separator} />

            <CustomButton
              className="mt-6 bg-red-300"
              title="Go to Map"
              onPress={async () => {
                router.push('/(root)/(tabs)/map-test')
              }}
            />
            <CustomButton
              className="mt-6 bg-red-300"
              title="generate plan"
              onPress={async () => {
                router.push('/(root)/(generate-plan)/gpt_test')
              }}
            />
            <CustomButton
              className="mt-6 bg-red-300"
              title="travel plan test"
              onPress={async () => {
                router.push('/(root)/(generate-plan)/explore')
              }}
            />
          </SignedIn>
          <SignedOut>
            <Text> {/* 确保 Link 被包裹在 Text 中 */}
              <Link href="/(auth)/sign-in">
                Sign In
              </Link>
            </Text>
            <Text> {/* 确保 Link 被包裹在 Text 中 */}
              <Link href="/(auth)/sign-up">
                Sign Up
              </Link>
            </Text>
          </SignedOut>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  searchContainer: {
    padding: 16,
    flexDirection: 'column',
    alignItems: 'center',
  },
  searchText: {
    marginBottom: 10,
    fontSize: 24,
    fontWeight: 'bold',
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    width: '100%',
    paddingHorizontal: 20,
  },
  iconWrapper: {
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconLabel: {
    textAlign: 'center',
    marginTop: 5,
    fontSize: 16, // 标签字体大小
  },
  iconContainer: {
    alignItems: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 20,
  },
  recommendSection: {
    paddingHorizontal: 16,
  },
  recommendRow: {
    flexDirection: 'row', // 设置为横向布局
    justifyContent: 'space-between',
  },
  recommendBox: {
    flex: 1, // 确保两个盒子均匀分布
    marginHorizontal: 5, // 设置盒子之间的间距
    padding: 16,
    borderColor: 'transparent',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: 'transparent',
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  recommendTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  recommendDescription: {
    color: '#555',
  },
  tipsSection: {
    paddingHorizontal: 16,
  },
  tipsText: {
    fontStyle: 'italic',
    marginBottom: 10,
  },
  tipItem: {
    marginBottom: 5,
    color: '#333',
  },
  buttonSection: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  contentWrapper: {
    marginBottom: 100,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
})