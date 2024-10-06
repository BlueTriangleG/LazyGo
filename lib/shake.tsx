import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import * as Location from 'expo-location';
// import your actual function here
import { generateDailyRecommends, RecommendDetail} from './gpt-daily-recommend';
import { CurrentRenderContext } from '@react-navigation/native';

interface AccelerometerData {
  x: number;
  y: number;
  z: number;
}

const ShakeDetector: React.FC = () => {
  const [subscription, setSubscription] = useState<any>(null);
  const [lastAccelerometer, setLastAccelerometer] = useState<AccelerometerData>({ x: 0, y: 0, z: 0 });
  const [shakeCount, setShakeCount] = useState(0);
  const [resetShakeCountTimerId, setResetShakeCountTimerId] = useState<NodeJS.Timeout | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendDetail[]>([]);


  const threshold = 3; 
  const shakeThreshold = 6; 
  const resetTime = 1000; 
  let generatePromise: Promise<void> | null = null; // 用于跟踪生成的 Promise

  useEffect(() => {
    _subscribe();
    return () => _unsubscribe();
  }, []);

  const _subscribe = () => {
    setSubscription(
      Accelerometer.addListener((accelerometerData) => {
        _checkShake(accelerometerData);
      })
    );
    Accelerometer.setUpdateInterval(100); 
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  const _checkShake = ({ x, y, z }: AccelerometerData) => {
    const last = lastAccelerometer;

    // 检查摇动是否超过阈值
    if (
      Math.abs(last.x - x) > threshold ||
      Math.abs(last.y - y) > threshold ||
      Math.abs(last.z - z) > threshold
    ) {
      setShakeCount(prevCount => {
        const newCount = prevCount + 1; 
        console.log(`Shake detected! Count: ${newCount}`);

        // 如果摇晃次数达到阈值，调用生成推荐的函数
        if (newCount >= shakeThreshold) {
          generateRecommendations(); // 调用生成推荐的函数
          resetShakeCount(); // 重置计数器
        }

        resetShakeCountTimer(); 
        return newCount;
      });
    }

    setLastAccelerometer({ x, y, z }); // 更新最后的加速度数据
  };

  const generateRecommendations = async () => {
    
    if (generatePromise) {
      console.log("Recommendation is already being generated. Please wait...");
      return; // 如果已有一个运行中的 Promise，则返回
    }
    
    generatePromise = new Promise(async (resolve) => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      const currenLocation = `${loc.coords.latitude},${loc.coords.longitude}`

      // const previous = [
      //   {
      //     "destination": "La Camera, Italian Restaurant",
      //     "destinationDescrib": "A popular Italian restaurant offering authentic cuisine in a cozy setting.",
      //     "vicinity": "MR2/3 Southgate Avenue, Southbank",
      //     "distance": "2.0 km",
      //     "estimatedPrice": "20 AUD"
      //   },
      //   {
      //     "destination": "Brother Baba Budan",
      //     "destinationDescrib": "A highly-rated café known for its excellent coffee and relaxed atmosphere.",
      //     "vicinity": "359 Little Bourke Street, Melbourne",
      //     "distance": "1.0 km",
      //     "estimatedPrice": "10 AUD"
      //   },
      //   {
      //     "destination": "Queen Victoria Market",
      //     "destinationDescrib": "A historic market featuring a variety of stalls selling fresh produce, food, and local goods.",
      //     "vicinity": "Queen Street, Melbourne",
      //     "distance": "1.2 km",
      //     "estimatedPrice": "15 AUD"
      //   }
      // ];

      try {
        console.log(`Current location: ${currenLocation}`)
        const recommends = await generateDailyRecommends(currenLocation);
        if (recommends){
          setRecommendations(recommends);
        }
        
        //TODO: Show the daily recommends on home page
        console.log(JSON.stringify(recommends));
      } catch (error) {
        console.error('Error generating recommendations:', error);
      } finally {
        generatePromise = null; 
        resolve(); 
      }
    });

    return generatePromise;
  };

  const resetShakeCount = () => {
    setShakeCount(0);
  };

  const resetShakeCountTimer = () => {
    if (resetShakeCountTimerId) clearTimeout(resetShakeCountTimerId);
    
    const timerId = setTimeout(() => {
      resetShakeCount();
    }, resetTime);
    setResetShakeCountTimerId(timerId);
  };

  // const sleep = (duration: number) => {
  //   return new Promise(resolve => setTimeout(resolve, duration));
  // };

  return (
    <View style={styles.container}>
    <Text>摇动手机以触发事件！</Text>
    <ScrollView style={styles.scrollView}>
      {recommendations.map((recommend, index) => (
        <View key={index} style={styles.recommendation}>
          <Text style={styles.title}>{recommend.destination}</Text>
          <Text>{recommend.destinationDescrib}</Text>
          <Text>地点: {recommend.vicinity}</Text>
          <Text>距离: {recommend.distance}</Text>
          <Text>估计价格: {recommend.estimatedPrice}</Text>
        </View>
      ))}
    </ScrollView>
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    width: '100%',
    marginTop: 20,
  },
  recommendation: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontWeight: 'bold',
  },
});

export default ShakeDetector;
