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

export type UserConfig = {
    minPrice?: number;
    maxPrice?: number;
    departureTime: string;
    transportation: string;
}

export default function Chat() {

    const [messages, setMessages] = useState<Message[]>([])

    // Initialize chats and options, use JSON.parse(JSON.stringify()) to deep copy the object
    const [chatsArray, setChatsArray] = useState<{content: string, keyword: string}[]>(JSON.parse(JSON.stringify(Object.values(presetChats))));
    const [optionsArray, setOptionsArray] = useState<{options: {content: string, key: string}[], keyword: string}[]>(JSON.parse(JSON.stringify(Object.values(presetOptions))));
    const [currentChat, setCurrentChat] = useState<string>("");
    const [progress, setProgress] = useState<number>(0);
    const [userConfig, setUserConfig] = useState<UserConfig>({
        departureTime: "",
        transportation: "",
    });
    const totalSteps = Object.values(presetOptions).find((options) => options.keyword === "init")?.options.length || 0;


    // Initialize chat with the first message from preset chats
    useEffect(() => {
        let initMsgContent = chatsArray.find((chat) => chat.keyword === "init");
        if (initMsgContent) {
            setCurrentChat(initMsgContent.keyword);
            let initMsg: Message = {
                content: initMsgContent.content,
                sender: "bot",
            };
            setMessages([initMsg]);
        }
    }, []);

    // Handle reset button
    const handleReset = () => {
        console.log("userConfig", userConfig);  
        let initMsgContent = chatsArray.find((chat) => chat.keyword === "init");
        setUserConfig({
            departureTime: "",
            transportation: "",
        });
        setProgress(0);
        setChatsArray(JSON.parse(JSON.stringify(Object.values(presetChats))));
        setOptionsArray(JSON.parse(JSON.stringify(Object.values(presetOptions))));
        if (initMsgContent) {
            setCurrentChat(initMsgContent.keyword);
            let initMsg: Message = {
                content: initMsgContent.content,
                sender: "bot",
            };
            setMessages([initMsg]);
        }
    }

    // Handle user's choice
    const handleButtonPress = (currentChat: string, key: string, content: string) => {
        // If current chat is init, find next chat based on user's choice
        if (currentChat === "init") {
            let nextChat = chatsArray.find((chat) => chat.keyword === key);
            if (nextChat) {
                setCurrentChat(nextChat.keyword);
                let nextMsg: Message = {
                    content: nextChat.content,
                    sender: "bot",
                };
                setMessages([...messages, nextMsg]);
            }
        } else {
            updateUserConfig(currentChat, key);

            // Find next chat based on user's choice
            let nextChat = chatsArray.find((chat) => chat.keyword === "init");
            if (nextChat) {
                // Update options based on user's choice
                optionsArray.forEach((chat) => {
                    if (chat.keyword === "init") {
                        chat.options.splice(chat.options.findIndex((option) => option.key === currentChat), 1);
                    }
                });
                setCurrentChat(nextChat.keyword);
                let nextMsg: Message = {
                    content: content,
                    sender: "user",
                };
                setMessages([...messages, nextMsg]);
                setProgress(progress + 1);
            }
        }
    }

    // Update user config based on user's choice
    function updateUserConfig(currentChat: string, key: string) {
        switch (currentChat) {
            case "price_level":
                let minPrice = parseInt(key.split(",")[0]);
                let maxPrice = parseInt(key.split(",")[1]);
                userConfig.minPrice = minPrice === -1? undefined: minPrice;
                userConfig.maxPrice = maxPrice === -1? undefined: maxPrice;
                setUserConfig({...userConfig});
                break;
            case "departure_time":
                userConfig.departureTime = key;
                setUserConfig({...userConfig});
                break;
            case "travel_mode":
                userConfig.transportation = key;
                setUserConfig({...userConfig});
                break;
            default:
                break;
        }
    }

    // Render each message 
    const renderItem = ({ item }: { item: Message }) => {
        return (
            <Text style={{...styles.messageItem, alignSelf: item.sender === "bot"? "flex-start": "flex-end"}}>
                {item.content}
            </Text>
        );
    };

    return (
        <SafeAreaView style={styles.contentWrapper}>
            <ScrollView style={styles.contentWrapper}>
                <ProgressBar 
                    style={{height: 10, width: '100%'}}
                    progress = {progress/totalSteps}
                    />
                <View style={styles.message_container}>
                    <FlashList estimatedItemSize={35} data={messages} renderItem={renderItem}/>
                </View>
                <View style={styles.options_container}>
                    {/* Render options based on current chat */}
                    {optionsArray.find((options) => options.keyword === currentChat)?.options.map((option: { content: string, key: string }) => {
                        return (
                            <CustomButton
                                title={option.content}
                                className="mt-6 bg-red-300"
                                onPress={() => handleButtonPress(currentChat, option.key, option.content)}
                                />
                        );
                    })}
                </View>
            </ScrollView>
            <View style={{marginBottom: 50}}>
                <CustomButton
                    title="Reset"
                    className="mt-6 bg-orange-300"
                    onPress={handleReset}
                    />
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
