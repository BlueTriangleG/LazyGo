import React, { useState } from 'react';
import { Modal, View, TextInput, Button, StyleSheet, Text } from 'react-native';

const AddMoreRes = ({ visible, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    // 处理搜索逻辑（例如，发送请求或筛选结果）
    console.log('Searching for:', searchTerm);
    // 清空输入框
    setSearchTerm('');
    // 关闭弹窗
    onClose();
  };

  return (
    <Modal animationType="slide" transparent visible={visible}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>搜索景点或餐厅</Text>
          <TextInput
            style={styles.input}
            placeholder="输入景点或餐厅名称"
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
          <Button title="搜索" onPress={handleSearch} />
          <Button title="取消" onPress={onClose} color="red" />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});

export default AddMoreRes;
