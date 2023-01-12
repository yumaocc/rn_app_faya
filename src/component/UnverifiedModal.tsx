// 未认证弹窗
import {Text, View} from 'react-native';
import React, {FC} from 'react';
import Modal from './Modal';
import {useNavigation} from '@react-navigation/core';
import {FakeNavigation} from '../models';
import {USER_AGREEMENT_URL} from '../constants/url';

interface UnverifiedModalProps {
  open: boolean;
  onChangeOpen: (value: boolean) => void;
}
const UnverifiedModal: FC<UnverifiedModalProps> = ({open, onChangeOpen}) => {
  const navigation = useNavigation() as FakeNavigation;
  return (
    <Modal
      visible={open}
      title="提示"
      onClose={() => onChangeOpen(false)}
      okText="立即认证"
      showCancel
      cancelText="为什么?"
      onCancel={() => {
        onChangeOpen(false);
        navigation.navigate({
          name: 'Browser',
          params: {
            url: USER_AGREEMENT_URL,
          },
        });
      }}
      onOk={() => {
        navigation.navigate('Cert');
        onChangeOpen(false);
      }}>
      <View style={{marginVertical: 30}}>
        <Text>此操作需要您先进行实名认证才能使用</Text>
      </View>
    </Modal>
  );
};
export default UnverifiedModal;
