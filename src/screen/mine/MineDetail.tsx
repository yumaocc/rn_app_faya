import React, {FC} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import {NavigationBar} from '../../component';
import Icon from '../../component/Form/Icon';
import {globalStyles, globalStyleVariables} from '../../constants/styles';
import {useUserDispatcher} from '../../helper/hooks';
import {UserState} from '../../models';
import {RootState} from '../../redux/reducers';

const MineDetail: FC = () => {
  const user = useSelector((state: RootState) => state.user.userInfo);
  useUserDispatcher();
  const idCardNoStr = (idNo: string) => {
    let newIdN0 = '';
    for (let i = 0; i < idNo.length; i++) {
      const element = idNo[i];
      if ((i = 0)) {
        newIdN0 += element;
      } else {
        newIdN0 += '*';
      }
    }
    return newIdN0;
  };
  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}} edges={['bottom']}>
        <NavigationBar title="个人资料" />
        <View style={[globalStyles.containerLR, {padding: globalStyleVariables.MODULE_SPACE, height: 60}, globalStyles.borderTop]}>
          <Text style={globalStyles.fontPrimary}>姓名</Text>
          <Text style={globalStyles.fontPrimary}>{user?.name}</Text>
        </View>
        <View style={[globalStyles.containerLR, {padding: globalStyleVariables.MODULE_SPACE}, globalStyles.borderTop]}>
          <Text style={globalStyles.fontPrimary}>头像</Text>
          <View style={styles.avatarWrapper}>
            <Image source={{uri: user?.avatar || 'https://fakeimg.pl/100?text=USER'}} style={{height: 60, width: 60}} />
          </View>
        </View>
        {user.status === UserState.CERTIFIED && (
          <View style={[globalStyles.containerCenter, globalStyles.moduleMarginTop, {padding: 20}]}>
            <View style={[globalStyles.containerCenter, globalStyles.moduleMarginTop, globalStyles.borderBottom]}>
              <Icon name="FYLM_all_feedback_true" color="#546DAD" size={100} />
              <Text style={[globalStyles.fontPrimary, globalStyles.moduleMarginTop]}>已实名认证</Text>
            </View>
          </View>
        )}
        <View style={[globalStyles.containerCenter]}>
          <View style={[globalStyles.containerCenter, globalStyles.moduleMarginTop, globalStyles.borderBottom, {paddingBottom: globalStyleVariables.MODULE_SPACE}]}>
            <Text style={[globalStyles.fontTertiary]}>真实姓名： {user.name}</Text>
            <Text style={[globalStyles.fontTertiary]}>身份证号 {idCardNoStr(user.idCard)}</Text>
          </View>
        </View>
        <View style={[globalStyles.containerCenter, {marginTop: 20}]}>
          <Text style={globalStyles.fontTertiary}>实名信息认证后不可修改</Text>
        </View>
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
