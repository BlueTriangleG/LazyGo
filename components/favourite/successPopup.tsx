import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Image, Dimensions } from 'react-native';

const SuccessPopup = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.delay(1200), 
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim]);

  return (
    <Animated.View
      style={[
        styles.container,
        { opacity: fadeAnim }, // 动态设置透明度
      ]}
    >
      <View style={styles.popup}>
        <Image
          source={require('@/assets/images/TravelCard/tick.gif')} // 替换为实际的tick图标路径
          style={styles.tickImage}
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '50%', 
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999, // 确保这个层在所有其他层的最上面
  },
  popup: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  tickImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
});

export default SuccessPopup;
