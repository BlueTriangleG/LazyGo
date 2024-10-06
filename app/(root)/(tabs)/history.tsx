import React from 'react';
import { Text, View, FlatList, StyleSheet, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const History = () => {
  // 模拟数据
  const historyData = [
    { id: '1', action: 'plan 1' },
    { id: '2', action: 'plan 2' },
    { id: '3', action: 'plan 3' },
  ];

  return (
    <ImageBackground 
      source={require('../../../assets/images/yellow.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      {/* 添加半透明遮罩层，提升文字可见度 */}
      <View style={styles.overlay} /> 
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>History</Text>
        <FlatList
          data={historyData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Text style={styles.itemText}>{item.action}</Text>
            </View>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',  // 半透明遮罩层，增强对比度
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // 半透明白色背景，适应整体风格
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: 'rgba(0, 0, 0, 0.7)', // 半透明文字
  },
  itemContainer: {
    padding: 20, // 增大padding使白板更大
    marginVertical: 10, // 增加间距
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // 白板半透明
    borderRadius: 12, // 增大圆角
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, // 增强阴影效果
  },
  itemText: {
    fontSize: 16,
    color: 'rgba(0, 0, 0, 0.8)', // 半透明文字，保证可见性
  },
  separator: {
    height: 10, // 每个白板项之间的间隔
  },
});

export default History;
