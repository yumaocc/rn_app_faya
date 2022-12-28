import React from 'react';
import {Badge, Icon, Button} from '@ant-design/react-native';
import {useNavigation} from '@react-navigation/native';
import {View, Text, ScrollView, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import {globalStyles, globalStyleVariables} from '../../constants/styles';
import {UserState} from '../../models';
import {RootState} from '../../redux/reducers';

import {FakeNavigation} from '../../models';
import {SectionGroup, OperateItem} from '../../component';
import {useUserDispatcher} from '../../helper/hooks';

const Mine: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.userInfo);
  const [userDispatcher] = useUserDispatcher();
  const navigation = useNavigation() as FakeNavigation;
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}} edges={['top']}>
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: globalStyleVariables.COLOR_PAGE_BACKGROUND,
        }}>
        <View style={{height: 50, backgroundColor: '#fff'}} />

        <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.navigate('MineDetail')}>
          <View style={styles.profile}>
            <View style={styles.avatarWrapper}>
              <Image source={{uri: user?.avatar || 'https://fakeimg.pl/100?text=USER'}} style={{height: 60, width: 60}} />
            </View>
            <View style={[styles.nameWrapper]}>
              <Text style={[globalStyles.fontPrimary, styles.name]}>{user?.name}</Text>
              {user.status === UserState.CERTIFIED && (
                <View style={[globalStyles.tagWrapper, styles.certWrapper]}>
                  <Icon name="safety" color="#4AB87D" size={15} />
                  <Text style={[globalStyles.tag, {color: '#4AB87D'}]}>已实名认证</Text>
                </View>
              )}
            </View>
            <Icon name="right" style={globalStyles.iconRight} />
          </View>
        </TouchableOpacity>
        <SectionGroup>
          <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.navigate('Cash')}>
            <OperateItem title="我的金库" icon={<Icon name="wallet" />} />
          </TouchableOpacity>
        </SectionGroup>
        <SectionGroup>
          <TouchableOpacity onPress={() => navigation.navigate('ContractList')}>
            <OperateItem title="合同管理" icon={<Icon name="wallet" />} />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.navigate('SPUList')}>
            <OperateItem
              title="我的商品"
              icon={<Icon name="wallet" />}
              extra={
                <Badge dot>
                  <View style={[globalStyles.tagWrapper]}>
                    <Text style={[globalStyles.fontTertiary, globalStyles.tag]}>{5}件商品即将下架</Text>
                  </View>
                </Badge>
              }
            />
          </TouchableOpacity>
        </SectionGroup>
        <SectionGroup>
          <OperateItem title="录入的商家" icon={<Icon name="shop" />} />
        </SectionGroup>
        <SectionGroup>
          <OperateItem title="设置" icon={<Icon name="setting" />} />
        </SectionGroup>
        <SectionGroup>
          <Button
            type="warning"
            onPress={() => {
              userDispatcher.logout();
            }}>
            退出登录
          </Button>
        </SectionGroup>
      </ScrollView>
    </SafeAreaView>
  );
};
export default Mine;

const styles = StyleSheet.create({
  container: {},
  profile: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  avatarWrapper: {
    borderRadius: 5,
    overflow: 'hidden',
  },
  nameWrapper: {
    flex: 1,
    justifyContent: 'flex-start',
    height: '100%',
    marginHorizontal: globalStyleVariables.MODULE_SPACE,
    paddingVertical: 5,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  certWrapper: {
    backgroundColor: '#4AB87D33',
    marginTop: 5,
  },
  certText: {
    fontSize: 12,
    marginLeft: 5,
  },
});
