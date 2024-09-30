import { SafeAreaView } from 'react-native-safe-area-context'
import { Text, View, StyleSheet, ScrollView } from 'react-native'
import { FlashList } from '@shopify/flash-list'

import { useEffect, useState } from 'react'

import presetChats from './data/preset-chats.json'
import presetOptions from './data/preset-options.json'
import CustomButton from '@/components/CustomButton'
import { ProgressBar } from 'react-native-paper';

type Message = {
    content: string;
    sender: string;
}

type UserConfig = {
    minPrice?: number;
    maxPrice?: number;
    departureTime: string;
    transportation: string;
}

export default function Chat() {

    const userConfig: UserConfig = {
        departureTime: "",
        transportation: "",
    }

    const [messages, setMessages] = useState<Message[]>([])

    const chatsArray = Object.values(presetChats);
    const optionsArray = Object.values(presetOptions);
    const [currentChat, setCurrentChat] = useState<string>("");
    
    const renderItem = ({ item }: { item: Message }) => {
        return (
            <Text style={{...styles.messageItem, alignSelf: item.sender === "bot"? "flex-start": "flex-end"}}>
                {item.content}
            </Text>
        );
    };

    useEffect(() => {
        let initMsgContent = chatsArray.find((chat) => chat.keyword === "init");
        if (initMsgContent) {
            setCurrentChat(initMsgContent.keyword);
            let initMsg: Message = {
                content: initMsgContent.content,
                sender: "bot",
            };
            setMessages([...messages, initMsg]);
        }
    }, []);

    return (
        <SafeAreaView style={styles.contentWrapper}>
            <ScrollView style={styles.contentWrapper}>
                <ProgressBar 
                    style={{height: 10, width: '100%'}}
                    progress = {1/3}
                    />
                <View style={styles.message_container}>
                    <FlashList estimatedItemSize={35} data={messages} renderItem={renderItem}/>
                </View>
                <View style={styles.options_container}>
                    {optionsArray.find((options) => options.keyword === currentChat)?.options.map((option: { content: string }) => {
                        return (
                            <CustomButton
                                title={option.content}
                                className="mt-6 bg-red-300"/>
                        );
                    })}
                </View>
            </ScrollView>
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
        height: '100%',
    },
    messageItem: {
        padding: 10,
        marginVertical: 10,
        borderRadius: 10,
        maxWidth: '90%',
        backgroundColor: 'lightgrey',
    },
    options_container: {
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 40,
    },
})
