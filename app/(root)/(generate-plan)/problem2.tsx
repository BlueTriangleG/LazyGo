import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from '@/components/CustomButton'
import { router } from 'expo-router'
import { useAnswers } from '@/app/(root)/(generate-plan)/AnswerContext'

export default function Problem2() {

  const { updateAnswer } = useAnswers(); // 使用 Context

  // 问题和答案选项
  const question = "Hello, is there a time limit for your trip?"
  const answers = [
    { id: 1, text: "A. No time limit", value: "no time limit" },
    { id: 2, text: "B. Half an hour", value: "half an hour" },
    { id: 3, text: "C. One hour", value: "one hour" }
  ]

  // 处理答案选择并跳转到 problem3 页面
  const handleAnswerPress = (answerValue) => {
    updateAnswer('answer2', answerValue); // 保存问题2的答案为 answer2
    router.push('/(root)/(generate-plan)/problem3')
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* 进度条部分 */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBar}>
          <View style={styles.progressFill} />
        </View>
        <Text style={styles.progressText}>2/3</Text>
      </View>

      {/* 问题部分 */}
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{question}</Text>
      </View>

      {/* 答案选项部分 */}
      <View style={styles.answersContainer}>
        {answers.map((answer) => (
          <CustomButton
            key={answer.id}
            title={answer.text}
            onPress={() => handleAnswerPress(answer.value)}
            className="mt-4 bg-blue-400"
          />
        ))}
      </View>
    </SafeAreaView>
  )
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
    width: '66%', // 当前页面为 2/3 进度
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
})
