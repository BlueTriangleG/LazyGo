import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FavoriteComponent = () => {
  const [favorites, setFavorites] = useState([]);

  const fetchFavoritesFromApi = async () => {
    try {
      // 从本地存储获取 email
      const email = await AsyncStorage.getItem('userEmail'); // 确保使用正确的键
      if (!email) {
        console.log('没有找到存储的 email');
        return;
      }

      // 打印获取到的 email
      console.log('获取到的 email:', email);

      // 调用 API 获取 favorite 数据
      const response = await fetch(`/(api)/favorite?email=${email}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('网络响应不正常');
      }

      const result = await response.json();

      // 检查返回的数据类型
      if (!Array.isArray(result)) {
        console.error('返回的数据不是一个数组:', result);
        return;
      }

      // 检查返回的数据
      if (result.length === 0) {
        console.log('没有找到与该 email 相关的 favorite 数据');
        return;
      }

      // 更新 state 中的 favorites
      setFavorites(result);

    } catch (error) {
      console.error('获取 favorite 数据时出错:', error);
    }
  };

  useEffect(() => {
    fetchFavoritesFromApi(); // 在组件挂载时调用
  }, []);

  // 点击按钮的处理函数
  const handleAddFavorite = (item) => {
    // 处理添加收藏的逻辑
    console.log('添加收藏的逻辑:', item);
  };

  // 渲染每个 favorite 的卡片
  const renderFavoriteCard = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.transportation}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <TouchableOpacity style={styles.cardButton} onPress={() => handleAddFavorite(item)}>
        <Text style={styles.cardButtonText}>添加</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>查看我的收藏</Text>
      <FlatList
        data={favorites}
        renderItem={renderFavoriteCard}
        keyExtractor={(item) => item.id.toString()} // 使用 id 作为 key
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
};

// 样式
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    width: 300, // 将宽度设置为 90%
    backgroundColor: '#ffffff', // 更改为白色背景
    borderRadius: 12, // 圆角更加明显
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 3, // 提升阴影效果
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    marginTop: 4,
    color: '#555', // 添加颜色以增强可读性
  },
  cardButton: {
    marginTop: 0, // 上方与文本的间距
    backgroundColor: '#007BFF', // 按钮背景色
    borderRadius: 30, // 圆角
    paddingVertical: 4,
    paddingHorizontal: 12,
    alignSelf: 'flex-end', // 右对齐
  },
  cardButtonText: {
    color: '#ffffff', // 按钮文本颜色
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FavoriteComponent;
