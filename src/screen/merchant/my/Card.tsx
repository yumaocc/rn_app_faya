import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
// import {BadgeFlag} from '../../../component';
import {globalStyles, globalStyleVariables} from '../../../constants/styles';
import {MyMerchantF, StylePropView} from '../../../models';

interface CardProps {
  merchant: MyMerchantF;
  style?: StylePropView;
}

const Card: React.FC<CardProps> = props => {
  const {merchant, style} = props;
  return (
    <View style={[styles.container, style]}>
      <View style={[globalStyles.borderBottom, styles.header]}>
        <View style={[styles.logo]}>
          <Image source={{uri: 'https://fakeimg.pl/100'}} style={{width: 40, height: 40}} />
        </View>
        <View style={styles.headerRight}>
          <View style={[globalStyles.flexNormal, {justifyContent: 'space-between'}]}>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <Text style={[globalStyles.textColorPrimary, styles.merchantName, {flex: 1}]} numberOfLines={1}>
                {merchant.name}
              </Text>
            </View>
            <View style={styles.tagWrapper}>
              <Text style={styles.tag}>合作中</Text>
            </View>
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
          <Text style={[globalStyles.fontSecondary, styles.centerText]}>商户模式</Text>
          <Text style={[globalStyles.fontPrimary, styles.centerTextValue]}>{merchant.multiStore ? '连锁' : '单店'}</Text>
        </View>
        <View>
          <Text style={[globalStyles.fontSecondary, styles.centerText]}>店铺数量</Text>
          <Text style={[globalStyles.fontPrimary, styles.centerTextValue]}>{merchant?.shopNums || 0}</Text>
        </View>
        <View>
          <Text style={[globalStyles.fontSecondary, styles.centerText]}>商品数量</Text>
          <Text style={[globalStyles.fontPrimary, styles.centerTextValue]}>{merchant?.saleProductNums || 0}</Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
        }}>
        <Text style={styles.button}>新增商品</Text>
        <Text style={styles.button}>跟进记录(20)</Text>
      </View>
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
