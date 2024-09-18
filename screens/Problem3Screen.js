import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function Problem3Screen({ navigation, route }) {
  const { answer1, answer2 } = route.params; // 获取前两个问题的答案
  const [answer3, setAnswer3] = useState(null); // 问题3的答案
  const [showGenerate, setShowGenerate] = useState(false); // 控制生成按钮的显示

  const handleAnswer = (selectedAnswer) => {
    setAnswer3(selectedAnswer);
    setShowGenerate(true); // 当选择答案后显示生成按钮
  };

  const handleGenerate = () => {
    // 跳转到 Plan 页面并传递所有选择的答案
    navigation.navigate('Plan', { answer1, answer2, answer3 });
  };

  return (
    <View style={styles.container}>

      {/* 进度条：显示完整进度 */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarFilled} />
        <View style={styles.progressBarFilled} />
        <View style={styles.progressBarFilled} />
      </View>

      {/* 推荐提示 */}
      <View style={styles.recommendationBox}>
        <Text style={styles.recommendationText}>
          We are almost there! What’s your favorite dessert?
        </Text>
      </View>

      {/* 按钮部分 */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.optionButton} onPress={() => handleAnswer('Cake')}>
          <Text style={styles.buttonText}>Cake</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionButton} onPress={() => handleAnswer('Ice Cream')}>
          <Text style={styles.buttonText}>Ice Cream</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionButton} onPress={() => handleAnswer('Fruit')}>
          <Text style={styles.buttonText}>Fruit</Text>
        </TouchableOpacity>
      </View>

      {/* generate 按钮 */}
      {showGenerate && (
        <TouchableOpacity style={styles.generateButton} onPress={handleGenerate}>
          <Text style={styles.generateButtonText}>Generate</Text>
        </TouchableOpacity>
      )}
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
    backgroundColor: '#d3d3d3',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 20,
  },
  progressBarFilled: {
    flex: 1,
    backgroundColor: '#8B4513', // 棕色，显示完整进度
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
  generateButton: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center', // 居中显示
    marginBottom: 20, // 与底部保持一些距离
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
