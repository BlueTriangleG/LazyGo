import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from '@/components/CustomButton'
import { router } from 'expo-router'
import { useRouter } from 'expo-router';
import { useAnswers } from '@/app/(root)/(generate-plan)/AnswerContext'

export default function Problem3() {

  const { answers, updateAnswer } = useAnswers(); // 使用 Context 获取答案和更新函数
  const router = useRouter(); // 获取路由对象

  // 问题和答案选项
  const question = "What is your estimated overdue spending?"
  const answerOptions = [
    { id: 1, text: "A. Under $20", value: "under 20" },
    { id: 2, text: "B. $20-$40", value: "20-40" },
    { id: 3, text: "C. Over $40", value: "over 40" }
  ]

  // 用于保存选中的答案
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showGenerateIcon, setShowGenerateIcon] = useState(false)

  // 处理答案选择
  const handleAnswerPress = (answerValue) => {
    setSelectedAnswer(answerValue);
    updateAnswer('answer3', answerValue); // 保存问题3的答案为 answer3
    setShowGenerateIcon(true) // 选择答案后显示图标
  }

  // 点击图标后跳转到 explore 页面，并提交所有答案给后端
  const handleGeneratePress = async () => {
    if (selectedAnswer) {
      try {
        const response = await fetch('https://your-backend-api.com/submit-plan', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            answers: {
              question1: answers.answer1,
              question2: answers.answer2,
              question3: answers.answer3,
            },
          }),
        });

        if (response.ok) {
          router.push('/(root)/(generate-plan)/explore'); // 请求成功后跳转到 explore 页面
        } else {
          console.error('提交失败: 请求失败');
        }
      } catch (error) {
        console.error('网络错误:', error);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 进度条部分 */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBar}>
          <View style={styles.progressFill} />
        </View>
        <Text style={styles.progressText}>3/3</Text>
      </View>

      {/* 问题部分 */}
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{question}</Text>
      </View>

      {/* 答案选项部分 */}
      <View style={styles.answersContainer}>
        {answerOptions.map((answer) => (
          <CustomButton
            key={answer.id}
            title={answer.text}
            onPress={() => handleAnswerPress(answer.value)}
            className="mt-4 bg-blue-400"
          />
        ))}
      </View>

      {/* 圆形图标，当选中答案时显示 */}
      {showGenerateIcon && (
        <TouchableOpacity style={styles.generateIcon} onPress={handleGeneratePress}>
          <Text style={styles.generateText}>Generate</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  progressBar: {
    flex: 1,
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginRight: 10,
  },
  progressFill: {
    width: '100%', // 当前页面为 3/3 进度
    height: '100%',
    backgroundColor: '#76c7c0',
    borderRadius: 5,
  },
  progressText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  questionContainer: {
    padding: 20,
    alignItems: 'center',
  },
  questionText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  answersContainer: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  generateIcon: {
    marginTop: 20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#76c7c0',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  generateText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});
