import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';

const NFCControl = () => {
  const [nfcEnabled, setNfcEnabled] = useState(false);
  const [data, setData] = useState<string | null>(null);

  useEffect(() => {
    // 初始化 NFC 管理器
    NfcManager.start()
      .then(() => setNfcEnabled(true))
      .catch((error) => {
        console.error('NFC Manager Error:', error);
        Alert.alert('NFC is not supported on this device.');
      });

    // 清理
    return () => {
      NfcManager.stop();
      NfcManager.setEventListener('stateChange', 'off');
    };
  }, []);

  const readNfc = async () => {
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();
      setData(tag);
      Alert.alert('NFC Data Read', JSON.stringify(tag));
    } catch (error) {
      console.error('Error reading NFC:', error);
      Alert.alert('Failed to read NFC tag');
    } finally {
      NfcManager.setEventListener(NfcTech.Ndef, 'off');
    }
  };

  const writeNfc = async (message: string) => {
    try {
      const bytes = NfcManager.stringToBytes(message);
      await NfcManager.requestTechnology(NfcTech.Ndef);
      await NfcManager.writeNdefMessage([{ 
        uri: message, // 使用 URI 格式
        type: 'text/plain' // 数据类型
      }]);
      Alert.alert('NFC Tag Written', `Message: ${message}`);
    } catch (error) {
      console.error('Error writing NFC:', error);
      Alert.alert('Failed to write NFC tag');
    } finally {
      NfcManager.setEventListener(NfcTech.Ndef, 'off');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>NFC Enabled: {nfcEnabled ? 'Yes' : 'No'}</Text>
      <Button title="Read NFC" onPress={readNfc} />
      <Button title="Write NFC" onPress={() => writeNfc('Your message here')} />
      {data && <Text>NFC Data: {JSON.stringify(data)}</Text>}
    </View>
  );
};

export default NFCControl;
