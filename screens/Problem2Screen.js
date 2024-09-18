import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function Problem2Screen({ navigation, route }) {
  const { answer1 } = route.params;

  const handleAnswer = (selectedAnswer) => {
    // 跳转到 Problem3 并传递选择的答案
    navigation.navigate('Problem3', { answer1, answer2: selectedAnswer });
  };

  return (
    <View style={styles.container}>

      {/* 进度条：显示2/3进度 */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarFilled} />
        <View style={styles.progressBarFilled} />
        <View style={styles.progressBarEmpty} />
      </View>

      {/* 推荐提示 */}
      <View style={styles.recommendationBox}>
        <Text style={styles.recommendationText}>
          Now, let’s refine the search! What kind of drink do you prefer?
        </Text>
      </View>

      {/* 按钮部分 */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.optionButton} onPress={() => handleAnswer('Tea')}>
          <Text style={styles.buttonText}>Tea</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionButton} onPress={() => handleAnswer('Coffee')}>
          <Text style={styles.buttonText}>Coffee</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionButton} onPress={() => handleAnswer('Juice')}>
          <Text style={styles.buttonText}>Juice</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  addressText: {
    fontSize: 14,
    color: '#000',
  },
  timeText: {
    fontSize: 14,
    color: '#000',
  },
  progressBarContainer: {
    flexDirection: 'row',
    height: 10,
    width: '100%',
    backgroundColor: '#d3d3d3', // 灰色背景
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 20,
  },
  progressBarFilled: {
    flex: 1, // 填充2/3的进度
    backgroundColor: '#8B4513', // 棕色
  },
  progressBarEmpty: {
    flex: 1, // 剩下的1/3未完成
    backgroundColor: '#ADD8E6',
  },
  recommendationBox: {
    backgroundColor: '#f1f1f1',
    padding: 15,
    borderRadius: 10,
    marginBottom: 40,
  },
  recommendationText: {
    fontSize: 16,
    color: '#000',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 30,
  },
  optionButton: {
    backgroundColor: '#f1f1f1',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginBottom: 15,
    width: '70%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#000',
  },
});
