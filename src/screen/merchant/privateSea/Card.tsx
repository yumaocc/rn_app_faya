import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {globalStyles, globalStyleVariables} from '../../../constants/styles';
import {useCommonDispatcher} from '../../../helper/hooks';
import * as api from '../../../apis';
import {BoolEnum, FakeNavigation, MerchantAction, MerchantCreateType, MerchantF, StylePropView} from '../../../models';
import {cleanTime} from '../../../helper/util';

interface CardProps {
  merchant: MerchantF;
  style?: StylePropView;
}

const Card: React.FC<CardProps> = ({merchant, style}) => {
  const [commonDispatcher] = useCommonDispatcher();
  async function inviteAuth(id: number) {
    try {
      await api.merchant.inviteAuth(id);
      commonDispatcher.success('已发送认证邀请');
    } catch (error) {
      commonDispatcher.error(error);
    }
  }

  const navigation = useNavigation() as FakeNavigation;

  return (
    <View style={[globalStyles.marginRightLeft]}>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => {
          if (merchant?.hasAuth) {
            navigation.navigate({
              name: 'ViewMerchant',
              params: {
                privateId: merchant.id,
                locationCompanyId: merchant?.locationCompanyId,
              },
            });
          } else {
            navigation.navigate({
              name: 'AddMerchant',
              params: {
                action: MerchantAction.EDIT,
                privateId: merchant.id,
                identity: MerchantCreateType.PRIVATE_SEA,
                locationCompanyId: merchant?.locationCompanyId,
              },
            });
          }
        }}>
        <View style={[style, styles.container]}>
          <View style={[globalStyles.borderBottom, styles.header]}>
            <View style={[styles.logo]}>
              <Image source={{uri: merchant?.avatar || 'https://fakeimg.pl/100'}} style={{width: 40, height: 40}} />
            </View>

            <View style={styles.headerRight}>
              <View style={[globalStyles.flexNormal, {justifyContent: 'space-between'}]}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <Text style={[globalStyles.textColorPrimary, styles.merchantName, {flex: 1}]} numberOfLines={1}>
                    {merchant.name}
                  </Text>
                </View>
                {merchant?.hasAuth ? (
                  <View style={globalStyles.tagWrapperGreen}>
                    <Text style={globalStyles.tagGreen}>已认证</Text>
                  </View>
                ) : (
                  <View style={styles.tagWrapper}>
                    <Text style={styles.tag}>未认证</Text>
                  </View>
                )}
              </View>
              <Text
                style={{
                  fontSize: 12,
                  color: globalStyleVariables.TEXT_COLOR_TERTIARY,
                }}>
                {merchant.categoryName}
              </Text>
            </View>
          </View>
          <View style={[globalStyles.containerLR, globalStyles.borderBottom, {paddingVertical: globalStyleVariables.MODULE_SPACE}]}>
            <View style={[globalStyles.containerCenter]}>
              <View style={[{marginBottom: 5}]}>
                <Text style={globalStyles.fontSecondary}>商户模式</Text>
              </View>
              <Text style={globalStyles.fontPrimary}>{merchant.multiStore === BoolEnum.TRUE ? '多店' : '单店'}</Text>
            </View>
            <View style={globalStyles.dividingLine} />
            <View style={[globalStyles.containerCenter, {paddingVertical: globalStyleVariables.MODULE_SPACE}]}>
              <View style={[{marginBottom: 5}]}>
                <Text style={globalStyles.fontPrimary}>认领时间</Text>
              </View>
              <Text style={globalStyles.fontSecondary}>{merchant?.claimTime ? cleanTime(merchant?.claimTime) : cleanTime(merchant?.createdTime)}</Text>
            </View>
            <View style={globalStyles.dividingLine} />
            <View style={[globalStyles.containerCenter, {paddingVertical: globalStyleVariables.MODULE_SPACE}]}>
              <View style={[{marginBottom: 5}]}>
                <Text style={globalStyles.fontPrimary}>认证状态</Text>
              </View>
              <Text style={globalStyles.fontSecondary}>{merchant?.hasAuth ? <Text style={{color: '#4AB87D'}}>已认证</Text> : <Text style={{color: '#999999'}}>未认证</Text>}</Text>
            </View>
          </View>

          {!!merchant?.hasAuth ? (
            <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.navigate('AddContract')}>
              <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                <Text style={styles.button}>邀请结算</Text>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity activeOpacity={0.5} onPress={() => inviteAuth(merchant.id)}>
              <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                <Text style={styles.button}>邀请认证</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};
export default Card;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  header: {
    flexDirection: 'row',
    paddingVertical: globalStyleVariables.MODULE_SPACE,
  },
  logo: {
    borderRadius: 5,
  },
  headerRight: {
    marginLeft: 10,
    flex: 1,
  },
  merchantName: {
    fontSize: 15,
    fontWeight: '500',
  },
  tagWrapper: {
    padding: 5,
    backgroundColor: '#FFB44333',
  },
  tag: {
    color: '#FFB443FF',
    fontSize: 10,
  },
  follow: {
    marginTop: 7,
    backgroundColor: '#f2f2f2',
    padding: 10,
    borderRadius: 5,
  },
  button: {
    color: globalStyleVariables.COLOR_PRIMARY,
    paddingVertical: 15,
    fontWeight: 'bold',
  },
});
