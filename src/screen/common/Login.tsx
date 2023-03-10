import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {InputItem, Button} from '@ant-design/react-native';

import {useSelector} from 'react-redux';
import {useCommonDispatcher, useUserDispatcher} from '../../helper/hooks';
import {RootState} from '../../redux/reducers';
import {FakeNavigation, LoginState} from '../../models';
import * as api from '../../apis';
import {globalStyles, globalStyleVariables} from '../../constants/styles';
import {useNavigation} from '@react-navigation/native';
import Radio from '../../component/Form/Radio';
import MyStatusBar from '../../component/MyStatusBar';
import {PRIVACY_POLICY_URL, USER_AGREEMENT_URL} from '../../constants/url';

const Login: React.FC = () => {
  const [radio, setRadio] = useState(false);
  const [phone, setPhone] = React.useState('');
  const [code, setCode] = React.useState(''); // 验证码
  const navigation = useNavigation() as FakeNavigation;
  const suggestPhone = useSelector((state: RootState) => state.user.phone);
  const loginState = useSelector((state: RootState) => state.user.loginState);
  const [verifyCodeSend, setVerifyCodeSend] = useState(false);
  const [resendAfter, setResendAfter] = useState(0);
  const [userDispatcher] = useUserDispatcher();
  const [commonDispatcher] = useCommonDispatcher();

  React.useEffect(() => {
    if (suggestPhone) {
      setPhone(suggestPhone);
    }
  }, [suggestPhone]);

  useEffect(() => {
    if (resendAfter <= 0) {
      setResendAfter(0);
      setVerifyCodeSend(false);
      return;
    }
    const timer = setInterval(() => {
      setResendAfter(resendAfter => resendAfter - 1);
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [resendAfter]);

  async function handleSendCode() {
    if (!phone) {
      return commonDispatcher.error('请输入手机号');
    }
    try {
      const res = await api.user.sendVerifyCode(phone);
      if (res) {
        commonDispatcher.info('验证码已发送，请注意查收!');
        setVerifyCodeSend(true);
        setResendAfter(60);
      }
    } catch (error) {
      commonDispatcher.error(error);
    }
  }

  function check(): string {
    if (!phone) {
      return '请输入手机号';
    }
    if (!code) {
      return '请输入验证码';
    }
    if (!radio) {
      return '请先阅读并同意入驻协议和隐私政策';
    }
  }
  function handleLogin() {
    const error = check();
    if (error) {
      commonDispatcher.error(error);
      return;
    }
    userDispatcher.login({phone, code});
  }

  return (
    <View style={styles.container}>
      <MyStatusBar />
      <ScrollView keyboardDismissMode="on-drag" style={{flex: 1}} keyboardShouldPersistTaps="always">
        <Text style={styles.title}>登录/注册</Text>
        <View style={styles.form}>
          <View style={styles.formItem}>
            <InputItem clear last value={phone} labelNumber={2} type="text" onChange={setPhone} placeholder="请输入手机号">
              <Text style={styles.phoneLabel}>+86</Text>
            </InputItem>
          </View>

          <Text style={styles.formExplain}>未注册的手机号验证通过后将自动注册</Text>
          <View style={[styles.formItem, styles.formItemCode]}>
            <InputItem
              clear
              last
              value={code}
              labelNumber={2}
              type="number"
              onChange={setCode}
              extra={
                verifyCodeSend ? (
                  <Text style={styles.phoneLabel}>重新发送({resendAfter})</Text>
                ) : (
                  <Text style={styles.getCode} onPress={handleSendCode}>
                    获取验证码
                  </Text>
                )
              }
              placeholder="请输入验证码"
            />
          </View>
          <Button style={styles.login} type="primary" onPress={handleLogin} loading={loginState === LoginState.Loading}>
            登录
          </Button>
          <View style={{flexDirection: 'row', alignItems: 'center', marginTop: globalStyleVariables.MODULE_SPACE}}>
            <Radio
              checked={radio}
              onChange={() => {
                setRadio(!radio);
              }}>
              <Text style={[globalStyles.fontTertiary, globalStyles.containerCenter]}>
                <Text>已阅读并同意</Text>

                <Text
                  onPress={() =>
                    navigation.navigate({
                      name: 'Browser',
                      params: {
                        url: USER_AGREEMENT_URL,
                      },
                    })
                  }
                  style={[globalStyles.fontTertiary, globalStyles.primaryColor]}>
                  《发芽联盟入驻协议》
                </Text>
                <Text> 和 </Text>
                <Text
                  onPress={() =>
                    navigation.navigate({
                      name: 'Browser',
                      params: {
                        url: PRIVACY_POLICY_URL,
                      },
                    })
                  }
                  style={[globalStyles.fontTertiary, globalStyles.primaryColor]}>
                  《发芽联盟隐私政策》
                </Text>
              </Text>
            </Radio>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    paddingTop: 94,
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
    marginTop: 30,
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
