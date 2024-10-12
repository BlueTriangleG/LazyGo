import { SafeAreaView } from 'react-native-safe-area-context'
import { Text, View, StyleSheet, ScrollView, Alert } from 'react-native'
import { FlashList } from '@shopify/flash-list'

import { useEffect, useState } from 'react'

import presetChats_res from './data/preset-chats-restaurant.json'
import presetOptions_res from './data/preset-options-restuarant.json'
import presetChats_caf from './data/preset-chats-cafe.json'
import presetOptions_caf from './data/preset-options-cafe.json'
import presetChats_ent from './data/preset-chats-entertainment.json'
import presetOptions_ent from './data/preset-options-entertainment.json'
import presetChats_att from './data/preset-chats-attractions.json'
import presetOptions_att from './data/preset-options-attractions.json'

import CustomButton from '@/components/CustomButton'
import { ProgressBar } from 'react-native-paper';
import { useLocalSearchParams } from 'expo-router'
import { getCurrentLocation } from '@/lib/location'
import { Activity, generatePlan_restaurant, Plan } from '@/lib/gpt-plan-generate'
import { router } from 'expo-router'

import TravelCard from '@/components/TravelPlanComponent/TravelCard';

type Message = {
    content: string | React.JSX.Element;
    sender: string;
}

export type UserConfig = {
    minPrice?: number;
    maxPrice?: number;
    departureTime: string;
    transportation: string;
    placeType?: string;
}

export type ChatProps = {
    placeType: string;
}

const Chat = (props: ChatProps) => {

    const [messages, setMessages] = useState<Message[]>([])
    const chatParams: ChatProps = useLocalSearchParams();
    const [currentLocation, setCurrentLocation] = useState<string>("");
    const [generating, setGenerating] = useState<boolean>(false);
    let presetChats = undefined;
    let presetOptions = undefined
    if (chatParams.placeType === "restaurant") {
       presetChats = presetChats_res;
       presetOptions = presetOptions_res;
    } else if (chatParams.placeType === "entertainment") {
        presetChats = presetChats_ent;
        presetOptions = presetOptions_ent;
    } else if (chatParams.placeType === "attraction") {
        presetChats = presetChats_att;
        presetOptions = presetOptions_att;
    } else if (chatParams.placeType === "cafe") {
        presetChats = presetChats_caf;
        presetOptions = presetOptions_caf;
    } 

    // Initialize chats and options, use JSON.parse(JSON.stringify()) to deep copy the object
    const [chatsArray, setChatsArray] = useState<{content: string, keyword: string}[]>(JSON.parse(JSON.stringify(Object.values(presetChats))));
    const [optionsArray, setOptionsArray] = useState<{options: {content: string, key: string}[], keyword: string}[]>(JSON.parse(JSON.stringify(Object.values(presetOptions))));
    const [currentChat, setCurrentChat] = useState<string>("");
    const [progress, setProgress] = useState<number>(0);
    const [userConfig, setUserConfig] = useState<UserConfig>({
        departureTime: "",
        transportation: "",
        placeType: chatParams.placeType,
    });
    const totalSteps = Object.values(presetOptions).find((options) => options.keyword === "init")?.options.length || 0;

    const initializeLocation = async () => {
        const curLocation = await getCurrentLocation();
        if (!curLocation) {
            Alert.alert('Please enable location service');
            return;
        }
        setCurrentLocation(curLocation);
    };

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
        initializeLocation();
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
    function updateUserConfig(currentChat: string, key:string) {
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
    const renderItem = ({ item, index }: { item: Message, index: number }) => {
        if (typeof item.content === "string") {
            return (
                <Text key={index} style={{...styles.messageItem, alignSelf: item.sender === "bot"? "flex-start": "flex-end"}}>
                    {item.content}
                </Text>
            );
        } else {
            return item.content;
        }
        
    };

    // Handle check details button
    const handleCheckDetails = (key: string, plan: Plan) => {
        router.push({pathname: '/(root)/(generate-plan)/explore', params: {date: key, plan: JSON.stringify(plan)}});
    }

    // Handle generate plan button
    const handleGeneratePlan = async () => {
        setGenerating(true);
        console.log("userConfig", userConfig);
        if (!currentLocation) {
            Alert.alert('Please enable location service');
            return;
        }
        const now = new Date();
        const futureTime = new Date(now.getTime() + (Number(userConfig.departureTime) * 60 * 1000)); // 加上20分钟
        const departureTime = new Date(futureTime.getTime() - (futureTime.getTimezoneOffset() * 60000)).toISOString();

        // Call API to generate plan
        const result: Plan|void = await generatePlan_restaurant(currentLocation, 
                                                                departureTime, 
                                                                userConfig.transportation, 
                                                                userConfig.minPrice, 
                                                                userConfig.maxPrice);
        if (!result) {
            Alert.alert('Failed to generate plan');
            return;
        }
        const newMessages: Message[] = [];
        Object.keys(result).forEach((key) => {
            let activities: Activity[] = result[Number(key)];
            const newMessage: Message = {
                content: (
                    <View>
                        <View style={styles.separator} />
                        <Text>Day {key}</Text>
                        {activities.map((data, index) => {
                            return (
                                <View  style={{width: '90%', marginLeft: 30}}>
                                    <TravelCard
                                        key={index}  // 确保每个 TravelCard 有唯一的 key
                                        time={data.time}
                                        duration={data.duration}
                                        destination={data.destination}
                                        destinationDescrib={data.destinationDescrib}
                                        destinationDuration={data.destinationDuration}
                                        transportation={data.transportation}
                                        distance={data.distance}
                                        estimatedPrice={data.estimatedPrice}
                                        startLocation={data.startLocation}
                                        endLocation={data.endLocation}
                                    />
                                </View>
                            );
                        })}
                        <CustomButton title={"Check Details"} 
                            className="mt-6 bg-orange-300"
                            onPress={() => {handleCheckDetails(key, result)}}
                        />
                        <View style={styles.separator} />
                    </View>
                ),
                sender: "bot",
            };
            newMessages.push(newMessage);
        });
        setMessages([...messages, ...newMessages]);
        setGenerating(false);
    }

    return (
        <SafeAreaView style={styles.contentWrapper}>
            <ScrollView style={styles.contentWrapper}>
                <ProgressBar 
                    style={{ height: 10, width: '100%' }}
                    progress={progress / totalSteps}
                />


                <View style={styles.message_container}>
                    <FlashList estimatedItemSize={35} data={messages} renderItem={renderItem} />
                </View>

            </ScrollView>

            <View style={{ marginBottom: 50 }}>
                
                <View style={styles.options_container}>
                    {/* Render options based on current chat */}
                    {optionsArray.find((options) => options.keyword === currentChat)?.options.map((option) => {
                        return (
                            <CustomButton
                                key={option.key} // 确保每个 button 有唯一的 key
                                title={option.content}
                                className="mt-6 bg-red-300"
                                onPress={() => handleButtonPress(currentChat, option.key, option.content)}
                            />
                        );
                    })}
                </View>
                <CustomButton
                    title={generating? "Generating...": "Generate Plan"}
                    disabled={generating}
                    style={{ display: progress !== totalSteps ? 'none' : 'flex' }}
                    className="mt-6 bg-orange-300"
                    onPress={handleGeneratePlan}
                    />
                <CustomButton
                    title="Reset"
                    className="mt-6 bg-orange-300"
                    onPress={handleReset}
                />
            </View>
        </SafeAreaView>
    )
}

export default Chat;

// Styles
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
    travelCardContainer: {
        top:0,
        marginTop: 0,
        paddingTop: 0,
        backgroundColor: '#ffffff', // 使用白色背景，更显干净
        padding: 16, // 内边距
        borderRadius: 12, // 增加圆角
        shadowColor: '#000', // 阴影颜色
        shadowOffset: {
            width: 0,
            height: 3, // 增加阴影高度
        },
        shadowOpacity: 0.2, // 增加阴影透明度
        shadowRadius: 6, // 增加阴影模糊半径
        elevation: 4, // 提升 Android 平台的阴影效果
        marginBottom: 20, // 下边距
        width: '90%', // 设置宽度为 90%
        alignSelf: 'center', // 使容器在父组件中水平居中
        borderWidth: 1, // 添加边框
        borderColor: '#e0e0e0', // 边框颜色
    },
    separator: {
        height: 1,
        backgroundColor: '#ddd',
        marginVertical: 30,
    },
})
