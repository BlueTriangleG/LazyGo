import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from '@/components/CustomButton'
import { router } from 'expo-router'
import { useAnswers } from '@/app/(root)/(generate-plan)/AnswerContext'

export default function Problem1() {

  const { updateAnswer } = useAnswers(); // 使用 Context

  // 问题和答案选项
  const question = "Hello, what kind of transportation would you like to take to the restaurant?"
  const answers = [
    { id: 1, text: "A. Walking", value: "walking" },
    { id: 2, text: "B. Bus, tram", value: "bus, tram" },
    { id: 3, text: "C. Taxi", value: "taxi" }
  ]

  // 处理答案选择并跳转到 problem2 页面
  const handleAnswerPress = (answerValue) => {
    updateAnswer('answer1', answerValue); // 保存问题1的答案为 answer1
    router.push('/(root)/(generate-plan)/problem2')
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* 进度条部分 */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBar}>
          <View style={styles.progressFill} />
        </View>
        <Text style={styles.progressText}>1/3</Text>
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
    width: '33%', // 当前页面为 1/3 进度
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
