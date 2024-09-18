import React from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';

export default function Problem1Screen({ navigation }) {
  
  const handleAnswer = (selectedAnswer) => {
    navigation.navigate('Problem2', { answer1: selectedAnswer });
  };

  return (
    <View style={styles.container}>

      {/* 进度条 */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarFilled} />
        <View style={styles.progressBarEmpty} />
      </View>

      {/* 推荐提示 */}
      <View style={styles.recommendationBox}>
        <Text style={styles.recommendationText}>
          Hi, Steven, we got several recommendations about restaurants!
        </Text>
      </View>

      {/* 按钮部分 */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.optionButton} onPress={() => handleAnswer('Time Limit')}>
          <Text style={styles.buttonText}>Trip in half an hour</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionButton} onPress={() => handleAnswer('Preference')}>
          <Text style={styles.buttonText}>Trip in one hour</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionButton} onPress={() => handleAnswer('Give me a plan')}>
          <Text style={styles.buttonText}>No time limit</Text>
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
    flex: 1, // 填充1/3
    backgroundColor: '#8B4513', // 棕色
  },
  progressBarEmpty: {
    flex: 2, // 填充2/3空白
    backgroundColor: '#ADD8E6', // 浅蓝色
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
