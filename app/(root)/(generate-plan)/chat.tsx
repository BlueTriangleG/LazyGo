import { SafeAreaView } from 'react-native-safe-area-context'
import { Text } from 'react-native'
import { commonStyles } from '@/styles/common-styles'
import { FlashList } from '@shopify/flash-list'

import { useEffect, useState } from 'react'

import presetChats from './data/preset-chats.json'
import presetOptions from './data/preset-options.json'


type Message = {
    id: string;
    content: string;
    sender: string;
    timestamp: string;
}

const mockMessages: Message[] = [
    {
        id: '1',
        content: 'Hello, how can I help you?',
        sender: 'bot',
        timestamp: '2022-09-29T10:00:00Z',
    },
    {
        id: '2',
        content: 'I want to know more about the plan.',
        sender: 'user',
        timestamp: '2022-09-29T10:01:00Z',
    },
    {
        id: '3',
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
            <Text>{item.content}</Text>
        );
    };

    useEffect(() => {
        setMessages(mockMessages);
    }, []);

    return (
        <SafeAreaView>
            <Text style={commonStyles.h1text}>This is a chat page.</Text>
            <FlashList data={messages} renderItem={renderItem}/>
        </SafeAreaView>
    )
}