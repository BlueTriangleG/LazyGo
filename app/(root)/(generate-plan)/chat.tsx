import { SafeAreaView } from 'react-native-safe-area-context'
import { Text, View, StyleSheet } from 'react-native'
import { commonStyles } from '@/styles/common-styles'
import { FlashList } from '@shopify/flash-list'

import { useEffect, useState } from 'react'

import presetChats from './data/preset-chats.json'
import presetOptions from './data/preset-options.json'


type Message = {
    content: string;
    sender: string;
    timestamp: string;
}

const mockMessages: Message[] = [
    {
        content: 'Hello, how can I help you?',
        sender: 'bot',
        timestamp: '2022-09-29T10:00:00Z',
    },
    {
        content: 'I want to know more about the plan.',
        sender: 'user',
        timestamp: '2022-09-29T10:01:00Z',
    },
    {
        content: 'Sure! What would you like to know?',
        sender: 'bot',
        timestamp: '2022-09-29T10:02:00Z',
    },
];


export default function Chat() {

    const [messages, setMessages] = useState<Message[]>([])

    const chatsArray = Object.values(presetChats);
    const optionsArray = Object.values(presetOptions);
     
    const renderItem = ({ item }: { item: Message }) => {
        return (
            <Text style={{...styles.messageItem, alignSelf: item.sender === "bot"? "flex-start": "flex-end"}}>
                {item.content}
            </Text>
        );
    };

    useEffect(() => {
        setMessages(mockMessages);
    }, []);

    return (
        <SafeAreaView style={styles.contentWrapper}>
            <Text style={commonStyles.h1text}>Chat</Text>
            <View style={styles.message_container}>
                <FlashList estimatedItemSize={35} data={messages} renderItem={renderItem}/>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    message_container: {
        flex: 1,
        width: '100%',
        height: '90%',
        padding: 20,
    },
    text: {
        fontSize: 18,
        marginBottom: 20,
        color: 'black',
    },
    contentWrapper: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    messageItem: {
        padding: 10,
        marginVertical: 10,
        borderRadius: 10,
        backgroundColor: 'lightgrey',
    },
})
