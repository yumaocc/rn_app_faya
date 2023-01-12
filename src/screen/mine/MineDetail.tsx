import React, {FC} from 'react';
import {View, Text, StyleSheet, Image, ScrollView, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import {NavigationBar} from '../../component';
import Icon from '../../component/Form/Icon';
import {globalStyles, globalStyleVariables} from '../../constants/styles';
import {useCommonDispatcher, useUserDispatcher} from '../../helper/hooks';
import {UserState} from '../../models';
import {RootState} from '../../redux/reducers';

const MineDetail: FC = () => {
  const [commonDispatcher] = useCommonDispatcher();
  const user = useSelector((state: RootState) => state.user.userInfo);
  useUserDispatcher();
  const idCardNoStr = (idNo: string) => {
    let newIdN0 = '';
    for (let i = 0; i < idNo?.length; i++) {
      const element = idNo[i];
      if (i === 0) {
        newIdN0 += element;
      } else {
        newIdN0 += '*';
      }
    }
    return newIdN0;
  };
  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: '#f4f4f4'}} edges={['bottom']}>
        <NavigationBar title="个人资料" />
        <ScrollView>
          <TouchableOpacity activeOpacity={0.5} onPress={() => commonDispatcher.info('认证后信息不可修改')}>
            <View style={[globalStyles.containerLR, {padding: globalStyleVariables.MODULE_SPACE, height: 70, backgroundColor: '#fff'}, globalStyles.borderTop]}>
              <Text style={globalStyles.fontPrimary}>姓名</Text>
              <Text style={globalStyles.fontPrimary}>{user?.name}</Text>
            </View>
          </TouchableOpacity>
          <View style={[globalStyles.containerLR, {padding: globalStyleVariables.MODULE_SPACE, backgroundColor: '#fff', height: 70}, globalStyles.borderTop]}>
            <Text style={globalStyles.fontPrimary}>头像</Text>
            <View style={styles.avatarWrapper}>
              <Image source={user?.avatar ? {uri: user?.avatar} : require('../../assets/avatar.png')} style={{height: 60, width: 60}} />
            </View>
          </View>
          {user?.status === UserState.CERTIFIED && (
            <View style={[globalStyles.containerCenter, globalStyles.moduleMarginTop, {padding: 20, backgroundColor: '#fff'}]}>
              <View style={[globalStyles.containerCenter, globalStyles.moduleMarginTop]}>
                <Icon name="FYLM_all_feedback_true" color="#546DAD" size={100} />
                <Text style={[globalStyles.fontPrimary, globalStyles.moduleMarginTop]}>实名认证已完成</Text>
              </View>
            </View>
          )}
          {user?.idCard && (
            <View style={[globalStyles.containerCenter, {paddingLeft: 60, paddingRight: 60, backgroundColor: '#fff'}]}>
              <View style={[{width: '100%', height: 120}, globalStyles.borderTop, globalStyles.containerCenter]}>
                <Text style={[globalStyles.fontTertiary]}>真实姓名： {user?.name}</Text>
                <Text style={[globalStyles.fontTertiary, globalStyles.moduleMarginTop]}>身份证号 {idCardNoStr(user?.idCard)}</Text>
              </View>
            </View>
          )}

          <View style={[globalStyles.containerCenter, {paddingLeft: 60, paddingRight: 60, backgroundColor: '#fff'}]}>
            <View style={[{width: '100%', height: 120}, globalStyles.borderTop, globalStyles.containerCenter]}>
              <Text style={[globalStyles.fontTertiary, globalStyles.moduleMarginTop, {marginBottom: globalStyleVariables.MODULE_SPACE}]}>实名信息认证后不可修改</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};
export default MineDetail;

const styles = StyleSheet.create({
  avatarWrapper: {
    borderRadius: 5,
    overflow: 'hidden',
  },
});
