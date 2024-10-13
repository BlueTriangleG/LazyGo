import React, { useEffect } from 'react';
import { Text, View, StyleSheet, SafeAreaView } from 'react-native';
import { useRoute } from '@react-navigation/native'; // 引入 useRoute 钩子

const Detail = () => {
  const route = useRoute(); // 获取路由对象
  const {
    id,
    duration,
    destination,
    destinationDescrib,
    destinationDuration,
    transportation,
    distance,
    estimatedPrice,
    startLocation,
    endLocation,
    detailedInfo,
    email,
  } = route.params || {}; // 获取传递的参数
  // 使用 useEffect 打印收到的数据
  useEffect(() => {
    console.log('Received Data:', {
      id,
      duration,
      destination,
      destinationDescrib,
      destinationDuration,
      transportation,
      distance,
      estimatedPrice,
      startLocation,
      endLocation,
      detailedInfo,
      email,
    });
  }, [id, duration, destination, destinationDescrib, destinationDuration, transportation, distance, estimatedPrice, startLocation, endLocation, detailedInfo, email]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>旅行详情</Text>
      <View style={styles.detailContainer}>
        <Text style={styles.detailText}>目的地: {destination}</Text>
        <Text style={styles.detailText}>描述: {destinationDescrib}</Text>
        <Text style={styles.detailText}>旅行时长: {duration}</Text>
        <Text style={styles.detailText}>交通方式: {transportation}</Text>
        <Text style={styles.detailText}>距离: {distance}</Text>
        <Text style={styles.detailText}>估计价格: {estimatedPrice}</Text>
        <Text style={styles.detailText}>起始位置: {startLocation}</Text>
        <Text style={styles.detailText}>结束位置: {endLocation}</Text>
        <Text style={styles.detailText}>详细信息: {detailedInfo}</Text>
        <Text style={styles.detailText}>用户邮箱: {email}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  detailContainer: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f8f8f8',
    elevation: 2,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
});

export default Detail;
