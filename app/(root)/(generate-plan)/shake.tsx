import React, { useEffect, useState } from 'react';
import { Accelerometer } from 'expo-sensors';
import { View, Text } from 'react-native';

interface ShakeDetectorProps {
  onShake: () => void; // 回调函数，无参数
  disabled?: boolean; // 可选的 disabled 属性
}

const ShakeDetector: React.FC<ShakeDetectorProps> = ({ onShake, disabled }) => {
  const [subscription, setSubscription] = useState<any>(null);
  const [lastAccelerometer, setLastAccelerometer] = useState({ x: 0, y: 0, z: 0 });
  const [shakeCount, setShakeCount] = useState(0);
  const threshold = 3; 
  const shakeThreshold = 6; 
  const resetTime = 1500; // 1.5秒

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

  const _checkShake = ({ x, y, z }: { x: number; y: number; z: number }) => {
    if (disabled) return;
    const last = lastAccelerometer;
  
    // 检查摇动是否超过阈值
    if (
      Math.abs(last.x - x) > threshold ||
      Math.abs(last.y - y) > threshold ||
      Math.abs(last.z - z) > threshold
    ) {
      // 在这里处理摇动计数
      setShakeCount((prevCount) => {
        const newCount = prevCount + 1;
  
        // 如果摇晃次数达到阈值，调用传入的 onShake 函数
        if (newCount >= shakeThreshold) {
          resetShakeCount(); // 重置计数器
          onShake(); // 直接调用传入的函数
        }
  
        resetShakeCountTimer(); // 每次摇动后重置计时器
        return newCount; // 返回新的摇动计数
      });
    }
  
    setLastAccelerometer({ x, y, z }); // 更新最后的加速度数据
  };
  
  

  let resetShakeCountTimerId: NodeJS.Timeout | null = null;

  const resetShakeCount = () => {
    setShakeCount(0);
  };

  const resetShakeCountTimer = () => {
    if (resetShakeCountTimerId) clearTimeout(resetShakeCountTimerId);

    // 设置一个新的定时器，在 1.5 秒后重置计数器
    resetShakeCountTimerId = setTimeout(() => {
      resetShakeCount();
    }, resetTime);
  };

  return (<View>
    <Text>Shake to generate again</Text>
  </View>); 
};

export default ShakeDetector;
