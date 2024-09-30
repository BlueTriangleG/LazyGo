import { SafeAreaView } from 'react-native-safe-area-context'
import { Text } from 'react-native'
import { commonStyles } from '@/styles/common-styles'

export default function Chat() {
    return (
        <SafeAreaView>
            <Text style={commonStyles.h1text}>This is a chat page.</Text>
            <Text>Chat page content</Text>
        </SafeAreaView>
    )
}