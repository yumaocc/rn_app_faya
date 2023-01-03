import {Button, Icon, InputItem} from '@ant-design/react-native';
import React, {FC, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import * as apis from '../../apis';
import {useCommonDispatcher, useUserDispatcher} from '../../helper/hooks';
import {useNavigation} from '@react-navigation/native';
import {FakeNavigation} from '../../models';

const Cert: FC = () => {
  const [idCard, setIdCard] = useState<string>();
  const [name, setName] = useState<string>();
  const navigation = useNavigation() as FakeNavigation;
  const [telephone, setTelephone] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [commonDispatcher] = useCommonDispatcher();
  const [userDispatcher] = useUserDispatcher();
  const handleClick = async () => {
    try {
      setLoading(true);
      await apis.user.certificate({
        name,
        idCard,
        telephone,
      });
      commonDispatcher.success('认证成功');
      userDispatcher.loadUserInfo();
      navigation.navigate('Home');
    } catch (error) {
      commonDispatcher.error(error);
    }
    setLoading(false);
  };
  return (
    <View style={styles.container}>
      <View style={{alignItems: 'center'}}>
        <Text style={styles.title}>为了您更好的使用体验</Text>
        <Text style={styles.title}>请先进行认证</Text>
      </View>
      <View style={styles.form}>
        <View style={styles.formItem}>
          <InputItem clear last value={name} labelNumber={2} type="text" onChange={setName} placeholder="姓名">
            <Icon name="user" />
          </InputItem>
        </View>
        <View style={[styles.formItem, styles.formItemCode]}>
          <InputItem clear last value={telephone} labelNumber={2} type="text" onChange={setTelephone} placeholder="手机号码">
            <Icon name="phone" />
          </InputItem>
        </View>
        <View style={[styles.formItem, styles.formItemCode]}>
          <InputItem clear last value={idCard} labelNumber={2} type="text" onChange={setIdCard} placeholder="身份证号码">
            <Icon name="idcard" />
          </InputItem>
        </View>
        <Button style={styles.login} disabled={name && idCard && telephone ? false : true} type="primary" onPress={handleClick} loading={loading}>
          提交认证
        </Button>
      </View>
    </View>
  );
};

export default Cert;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 94,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  form: {
    marginTop: 66,
    width: '100%',
    paddingHorizontal: 20,
  },
  formItem: {
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
  },
  formItemCode: {
    marginTop: 10,
  },
  formExplain: {
    marginTop: 10,
    color: '#999',
    fontSize: 12,
  },
  getCode: {
    color: '#546DAD',
    fontSize: 15,
  },
  phoneLabel: {
    fontSize: 15,
    color: '#999',
  },
  login: {
    width: '100%',
    marginTop: 40,
  },
});
