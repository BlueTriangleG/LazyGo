import CustomButton from '@/components/CustomButton'
import { Link, router } from 'expo-router'
import { StyleSheet, Text, View, ScrollView, Image, ImageBackground} from 'react-native'
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
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.contentWrapper}>
          <SignedIn>
            
            <Text style={styles.topText}>Address</Text>
            <View style={styles.separator} />

            {/* 第一部分：图标部分 */}
            <View style={styles.searchContainer}>
              <View style={styles.iconRow}>
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

            {/* 第二部分：推荐部分 */}
            <View style={styles.recommendSection}>
              <Text style={styles.leftAlignedText}>Recommend for you</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScrollView}>
                {/* 第一张和第二张部分可见 */}
                <View style={styles.card}>
                  <Image source={require('../../../assets/images/home.png')} style={styles.cardImage} />
                  <Text style={styles.cardTitle}>ABC Restaurant</Text>
                  <Text style={styles.cardSubtitle}>517m - A great restaurant near you</Text>
                </View>
                <View style={styles.card}>
                  <Image source={require('../../../assets/images/yellow.png')} style={styles.cardImage} />
                  <Text style={styles.cardTitle}>NFC Museum</Text>
                  <Text style={styles.cardSubtitle}>5km - Famous museum in the area</Text>
                </View>
                <View style={styles.card}>
                  <Image source={require('../../../assets/images/background.png')} style={styles.cardImage} />
                  <Text style={styles.cardTitle}>XYZ Cafe</Text>
                  <Text style={styles.cardSubtitle}>1.2km - Cozy place for coffee</Text>
                </View>
                <View style={styles.card}>
                  <Image source={require('../../../assets/images/background.png')} style={styles.cardImage} />
                  <Text style={styles.cardTitle}>City Theatre</Text>
                  <Text style={styles.cardSubtitle}>2km - Popular movie spot</Text>
                </View>
              </ScrollView>
            </View>

            <View style={styles.separator} />

            {/* 第三部分：Tips部分，需要下滑才能看到 */}
            <View style={styles.tipsSection}>
              <Text style={styles.leftAlignedText}>Tips from Lazy Go</Text>
              <Text style={styles.tipsText}>Hi! Good morning! Welcome to lazy go. Today is rainy, remember to bring your umbrella if you go out!</Text>
              <Text style={styles.tipsText}>1. Bring umbrella</Text>
              <Text style={styles.tipsText}>2. Go to ABC restaurant</Text>
              <Text style={styles.tipsText}>3. Bring your ID card</Text>
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
  safeArea: {
    flex: 1,
  },
  contentWrapper: {
    flex: 1,
  },
  searchContainer: {
    flex: 1, // 占据三分之一
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5, // 统一上下间距
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
    marginVertical: 5, // 统一上下间距
  },
  recommendSection: {
    flex: 2, // 占据三分之二
    paddingHorizontal: 16,
    marginVertical: 5, // 统一上下间距
  },
  horizontalScrollView: {
    flexDirection: 'row',
    paddingLeft: 8,
    marginVertical: 5, // 统一上下间距
  },
  card: {
    width: 350, // 加大卡片宽度
    marginRight: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 4,
    marginVertical: 5, // 统一上下间距
  },
  cardImage: {
    width: '100%',
    height: 350, // 调整图片高度
    resizeMode: 'cover',
  },
  tipsSection: {
    flex: 1, // 占据三分之一，需下滑才能看到
    paddingHorizontal: 16,
    marginVertical: 5, // 统一上下间距
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 8,
  },
  cardSubtitle: {
    fontSize: 16,
    color: '#555',
    paddingHorizontal: 8,
    paddingBottom: 8,
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
    marginVertical: 5,
    fontSize: 20, // 标签字体大小
  },
  iconContainer: {
    alignItems: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 5,         // 统一上下间距
  },
  leftAlignedText: {
    textAlign: 'left',          // 左对齐文本
    fontSize: 24,               // 标题大小，可以根据需要调整
    fontWeight: 'bold',         // 加粗字体
    marginVertical: 5,          // 下方与内容的距离（图片或文本）
    paddingHorizontal: 8,        // 设置与水平滚动区域相同的左右间距
    alignSelf: 'flex-start',     // 确保文本左对齐且与父容器左侧对齐
    color: '#000',              // 设置文本颜色
  },
  topText: {
    textAlign: 'left',          // 左对齐文本
    fontSize: 20,               // 文字大小
    fontWeight: 'bold',         // 加粗字体
    marginVertical: 5,         // 统一上下间距        
    paddingHorizontal: 32,       // 设置与水平滚动区域相同的左右间距
    color: '#000',
  },
  tipsText: {
    textAlign: 'left',          // 左对齐文本
    fontSize: 16,               // 文字大小
    marginVertical: 5,         // 统一上下间距        
    paddingHorizontal: 16,       // 设置与水平滚动区域相同的左右间距
    color: '#000',
  },
  
})