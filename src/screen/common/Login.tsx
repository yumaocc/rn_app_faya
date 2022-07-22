import React from 'react';
import {View, Text, TextInput, Button} from 'react-native';
import {useSelector} from 'react-redux';
import {styles} from '../../helper';
import {useUserDispatcher} from '../../helper/hooks';
import {RootState} from '../../redux/reducers';

const Login: React.FC = () => {
  const [phone, setPhone] = React.useState('');
  const [code, setCode] = React.useState(''); // 验证码
  const suggestPhone = useSelector((state: RootState) => state.user.phone);

  React.useEffect(() => {
    if (suggestPhone) {
      setPhone(suggestPhone);
    }
  }, [suggestPhone]);

  const [userDispatcher] = useUserDispatcher();
  return (
    <View style={styles.containerForTmp}>
      <Text>登录页面</Text>
      <TextInput
        value={phone}
        onChangeText={setPhone}
        placeholder="输入手机号"
      />
      <TextInput value={code} onChangeText={setCode} placeholder="输入验证码" />
      <Button
        title="登录"
        onPress={() => {
          userDispatcher.login({phone, code});
        }}
      />
    </View>
  );
};
export default Login;
