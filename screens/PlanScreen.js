import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

export default function PlanScreen() {
  const [userInput, setUserInput] = useState(''); // 用户输入的文本
  const [userQuestion, setUserQuestion] = useState(''); // 用户提交的问题
  const [appResponse, setAppResponse] = useState(''); // App 的回答（预留API）

  // 提交用户输入
  const handleSend = () => {
    setUserQuestion(userInput);
    setAppResponse('This is the app response.'); // 预留文本
    setUserInput(''); // 清空输入框
  };

  return (
    <View style={styles.container}>

      <ScrollView style={styles.planContainer}>
        {/* Plan 显示区域 */}
        <View style={styles.planBox}>
          <Text style={styles.timeTextPlan}>09:20</Text>
          <Text style={styles.planText}>Walk 3m</Text>
          <Text style={styles.timeTextPlan}>09:23</Text>
          <Text style={styles.planText}>Eat 21m</Text>
          <Text style={styles.timeTextPlan}>09:44</Text>
          <Text style={styles.planText}>ABC Restaurant</Text>
        </View>

        {/* 用户问题显示区域 */}
        {userQuestion ? (
          <View style={styles.questionBox}>
            <Text style={styles.userQuestion}>{userQuestion}</Text>
          </View>
        ) : null}

        {/* App 响应显示区域 */}
        {appResponse ? (
          <View style={styles.responseBox}>
            <Text style={styles.appResponse}>{appResponse}</Text>
          </View>
        ) : null}
      </ScrollView>

      {/* 提示用户输入的文本 */}
      <Text style={styles.inputPrompt}>Give me further instruction for other requirements!</Text>

      {/* 输入框和发送按钮 */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ask Lazy go"
          value={userInput}
          onChangeText={(text) => setUserInput(text)}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Send</Text>
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
  planContainer: {
    flex: 1,
  },
  planBox: {
    backgroundColor: '#f1f1f1',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  timeTextPlan: {
    fontSize: 12,
    color: '#FF69B4', // 粉红色时间标识
    marginBottom: 5,
  },
  planText: {
    fontSize: 16,
    marginBottom: 15,
    color: '#000',
  },
  questionBox: {
    backgroundColor: '#f1f1f1',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignSelf: 'flex-end', // 用户输入显示在右侧
  },
  userQuestion: {
    fontSize: 16,
    color: '#000',
  },
  responseBox: {
    backgroundColor: '#f1f1f1',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  appResponse: {
    fontSize: 16,
    color: '#000',
  },
  inputPrompt: {
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
    textAlign: 'center', // 居中对齐提示文本
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
