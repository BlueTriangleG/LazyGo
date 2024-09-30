import CustomButton from '@/components/CustomButton'
import { Link, router } from 'expo-router'
import { StyleSheet, Text, View, ScrollView } from 'react-native'
import { commonStyles } from '@/styles/common-styles'
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FontAwesome } from '@expo/vector-icons'

export default function Page() {
  const { user } = useUser()

  return (
    <SafeAreaView>
      <ScrollView style={styles.contentWrapper}>
        <SignedIn>
        <Text style={commonStyles.h1text}>Welcome Lazy Go</Text>

        <View style={styles.separator} />

        {/* Search bar and icon navigation section */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchText}>What you want?</Text>
          <View style={styles.iconRow}>
            {/* Put each icon into a circular color box */}
            <View style={[styles.iconWrapper, { backgroundColor: '#FFCDD2' }]}>
              <FontAwesome name="cutlery" size={30} color="black" onPress={() => router.push('/(root)/(generate-plan)/chat')} />
            </View>
            <View style={[styles.iconWrapper, { backgroundColor: '#C8E6C9' }]}>
              <FontAwesome name="coffee" size={30} color="black" onPress={() => router.push('/(root)/(generate-plan)/problem1')} />
            </View>
            <View style={[styles.iconWrapper, { backgroundColor: '#BBDEFB' }]}>
              <FontAwesome name="university" size={30} color="black" onPress={() => router.push('/(root)/(generate-plan)/chat')} />
            </View>
            <View style={[styles.iconWrapper, { backgroundColor: '#FFE082' }]}>
              <FontAwesome name="film" size={30} color="black" onPress={() => router.push('/(root)/(generate-plan)/chat')} />
            </View>
          </View>
        </View>

        <View style={styles.separator} />

        {/* Recommendation section */}
        <View style={styles.recommendSection}>
          <Text style={commonStyles.h1text}>Recommend for you!</Text>
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
        <Link href="/(auth)/sign-in">
          <Text>Sign In</Text>
        </Link>
        <Link href="/(auth)/sign-up">
          <Text>Sign Up</Text>
        </Link>
      </SignedOut>
      </ScrollView>
    </SafeAreaView>
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
    fontSize: 18,
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
  separator: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 20,
  },
  recommendSection: {
    paddingHorizontal: 16,
  },
  recommendBox: {
    marginVertical: 10,
    padding: 16,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
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
})