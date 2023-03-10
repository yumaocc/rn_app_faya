import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
// import {BadgeFlag} from '../../../component';
import {globalStyles, globalStyleVariables} from '../../../constants/styles';
import {BoolEnum, FakeNavigation, MyMerchantF, StylePropView} from '../../../models';

interface CardProps {
  merchant: MyMerchantF;
  style?: StylePropView;
}

const Card: React.FC<CardProps> = props => {
  const {merchant, style} = props;
  const navigation = useNavigation() as FakeNavigation;
  return (
    <View style={[styles.container, style, {marginLeft: globalStyleVariables.MODULE_SPACE, marginRight: globalStyleVariables.MODULE_SPACE}]}>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() =>
          navigation.navigate({
            name: 'MyMerchantDetail',
            params: {
              id: merchant.id,
              name: merchant.name,
              status: merchant.status,
              locationCompanyId: merchant?.locationCompanyId,
            },
          })
        }>
        <View style={[globalStyles.borderBottom, styles.header]}>
          <View style={[styles.logo]}>
            <Image source={{uri: merchant?.avatar}} style={{width: 40, height: 40, borderRadius: 5}} />
          </View>
          <View style={styles.headerRight}>
            <View style={[globalStyles.flexNormal, {justifyContent: 'space-between'}]}>
              <View style={{flex: 1, flexDirection: 'row'}}>
                <Text style={[globalStyles.textColorPrimary, styles.merchantName, {flex: 1}]} numberOfLines={1}>
                  {merchant.name}
                </Text>
              </View>

              {!!merchant?.status ? (
                <View style={globalStyles.tagWrapperGreen}>
                  <Text style={globalStyles.tagGreen}>·合作中</Text>
                </View>
              ) : (
                <View style={{backgroundColor: 'rgba(255, 96, 96, 0.2)', padding: 5, borderRadius: 3}}>
                  <Text style={{color: '#FF6060', fontSize: 10}}>·即将调入公海</Text>
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

        <View
          style={[
            globalStyles.borderBottom,
            {
              flexDirection: 'row',
              justifyContent: 'space-around',
              paddingVertical: 16,
            },
          ]}>
          <View>
            <Text style={[globalStyles.fontSize12, styles.centerText]}>商户模式</Text>
            <Text style={[globalStyles.fontPrimary, styles.centerTextValue]}>{merchant.multiStore === BoolEnum.TRUE ? '多店' : '单店'}</Text>
          </View>
          <View>
            <Text style={[globalStyles.fontSize12, styles.centerText]}>店铺数量</Text>
            <Text style={[globalStyles.fontPrimary, styles.centerTextValue]}>{merchant?.shopNums || 0}</Text>
          </View>
          <View>
            <Text style={[globalStyles.fontSize12, styles.centerText]}>商品数量</Text>
            <Text style={[globalStyles.fontPrimary, styles.centerTextValue]}>{merchant?.saleProductNums || 0}</Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              navigation.navigate({
                name: 'MyMerchantDetail',
                params: {
                  id: merchant.id,
                  name: merchant.name,
                  status: merchant.status,
                  from: 'module',
                },
              });
            }}>
            <Text style={styles.button}>型号管理</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.navigate('AddSPU')}>
            <Text style={styles.button}>新增商品</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
      {/* 左上角 NEW徽标 */}
      {/* <BadgeFlag label="NEW" /> */}
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
    position: 'relative',
    overflow: 'hidden',
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
  button: {
    color: globalStyleVariables.COLOR_PRIMARY,
    paddingVertical: 15,
    fontWeight: 'bold',
  },
  centerText: {
    textAlign: 'center',
  },
  centerTextValue: {
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 10,
  },
});
