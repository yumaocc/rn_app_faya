import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {InputItem, Button, Toast} from '@ant-design/react-native';
import {useSelector} from 'react-redux';
import {useCommonDispatcher, useUserDispatcher} from '../../helper/hooks';
import {RootState} from '../../redux/reducers';
import {FakeNavigation, LoginState} from '../../models';
import * as api from '../../apis';
import {globalStyles, globalStyleVariables} from '../../constants/styles';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import Radio from '../../component/Form/Radio';

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

  function handleLogin() {
    if (!phone) {
      return Toast.info('请输入手机号');
    }
    if (!code) {
      Toast.info('请输入验证码');
      return;
    }
    if (!radio) {
      return Toast.info('请同意用户协议');
    }
    userDispatcher.login({phone, code});
  }

  return (
    <View style={styles.container}>
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
            <Text style={[globalStyles.fontTertiary, {lineHeight: 15}]}>
              登录即表示您同意
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() =>
                  navigation.navigate({
                    name: 'Browser',
                    params: {
                      url: 'https://faya-manually-file.faya.life/protocol/faya-user-bd.html',
                    },
                  })
                }>
                <Text style={globalStyles.primaryColor}> 《发芽联盟入驻协议》</Text>
              </TouchableOpacity>
            </Text>
          </Radio>
        </View>
      </View>
    </View>
  );
};
export default Login;

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
