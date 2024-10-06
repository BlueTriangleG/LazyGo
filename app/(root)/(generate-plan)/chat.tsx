import { SafeAreaView } from 'react-native-safe-area-context'
import { Text, View, StyleSheet, ScrollView } from 'react-native'
import { FlashList } from '@shopify/flash-list'

import { useEffect, useState } from 'react'

import presetChats from './data/preset-chats.json'
import presetOptions from './data/preset-options.json'
import CustomButton from '@/components/CustomButton'
import { ProgressBar } from 'react-native-paper';
import { useLocalSearchParams } from 'expo-router'

import TravelCard from '@/components/TravelPlanComponent/TravelCard';

const travelData = {
    "1": [
      {
        time: '08:00',
        duration: '2h',
        destination: 'Tokyo Tower',
        destinationDescrib:
          '東京鐵塔，正式名稱為日本電波塔，是位於日本東京芝公園的一座電波塔。建於1958年。高332.9公尺，是日本第二高的結構物，僅次於東京晴空塔。',
        destinationDuration: '1h',
        transportation: 'Public',
        distance: '3km',
        estimatedPrice: '15 EUR',
        startLocation: '35.6500,139.7500', // start lat, long
        endLocation: '35.6586,139.7454', // end lat long (Tokyo Tower)
      },
      {
        time: '08:00',
        duration: '2h',
        destination: 'Tokyo Tower',
        destinationDescrib:
          '東京鐵塔，正式名稱為日本電波塔，是位於日本東京芝公園的一座電波塔。建於1958年。高332.9公尺，是日本第二高的結構物，僅次於東京晴空塔。',
        destinationDuration: '1h',
        transportation: 'Public',
        distance: '3km',
        estimatedPrice: '15 EUR',
        startLocation: '35.6500,139.7500', // start lat, long
        endLocation: '35.6586,139.7454', // end lat long (Tokyo Tower)
      },
      {
        time: '08:00',
        duration: '2h',
        destination: 'Tokyo Tower',
        destinationDescrib:
          '東京鐵塔，正式名稱為日本電波塔，是位於日本東京芝公園的一座電波塔。建於1958年。高332.9公尺，是日本第二高的結構物，僅次於東京晴空塔。',
        destinationDuration: '1h',
        transportation: 'Public',
        distance: '3km',
        estimatedPrice: '15 EUR',
        startLocation: '35.6500,139.7500', // start lat, long
        endLocation: '35.6586,139.7454', // end lat long (Tokyo Tower)
      },
      {
        time: '10:30',
        duration: '1.5h',
        destination: 'Shiba Park',
        destinationDescrib: '芝公园，靠近东京铁塔的大型绿地。',
        destinationDuration: '2h',
        transportation: 'Car',
        distance: '2.5km',
        estimatedPrice: '3 EUR',
        startLocation: '35.6586,139.7454', // 起点的经纬度 (Tokyo Tower)
        endLocation: '35.6544,139.7480', // 终点的经纬度 (Shiba Park)
      },
    ],
    "2": [
      {
        time: '09:00',
        duration: '1.5h',
        destination: 'Zojoji Temple',
        destinationDescrib: '增上寺，东京著名的佛教寺庙。',
        destinationDuration: '1.5h',
        transportation: 'Bicycle',
        distance: '1.8km',
        estimatedPrice: '2 EUR',
        startLocation: '35.6544,139.7480', 
        endLocation: '35.6580,139.7488', 
      },
      {
        time: '11:00',
        duration: '2h',
        destination: 'Roppongi Hills',
        destinationDescrib: '六本木新城，时尚和文化的中心。',
        destinationDuration: '2h',
        transportation: 'Walk',
        distance: '4km',
        estimatedPrice: '20 EUR',
        startLocation: '35.6580,139.7488', 
        endLocation: '35.6604,139.7292',
      },
      {
        time: '13:00',
        duration: '1h',
        destination: 'Atago Shrine',
        destinationDescrib: '爱宕神社，历史悠久的庙宇和著名的石阶。',
        destinationDuration: '1h',
        transportation: 'Public',
        distance: '1km',
        estimatedPrice: '5 EUR',
        startLocation: '35.6604,139.7292', 
        endLocation: '35.6650,139.7495',
      },
    ],
  }

type Message = {
    content: string;
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
                    style={{ height: 10, width: '100%' }}
                    progress={progress / totalSteps}
                />


                <View style={styles.message_container}>
                    <FlashList estimatedItemSize={35} data={messages} renderItem={renderItem} />
                </View>

                {/* 在这里添加 TravelCard */}
                {progress === totalSteps && travelData["1"]?.length > 0 && (
                <View style={styles.travelCardContainer}>
                    {travelData["1"].map((data, index) => (
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
                    ))}
                </View>
            )}
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
            </ScrollView>

            <View style={{ marginBottom: 50 }}>
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
    
})
