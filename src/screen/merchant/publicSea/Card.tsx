import {Icon} from '@ant-design/react-native';
import React, {useState} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {PlusButton} from '../../../component';
// import {BadgeFlag} from '../../../component';
import Loading from '../../../component/Loading';
import {useCommonDispatcher} from '../../../helper/hooks';
import * as api from '../../../apis';
import {globalStyles, globalStyleVariables} from '../../../constants/styles';
import {FakeNavigation, MerchantAction, MerchantCreateType, MerchantF, StylePropView} from '../../../models';
import {useNavigation} from '@react-navigation/native';

interface CardProps {
  merchant: MerchantF;
  style?: StylePropView;
  update: () => void;
}

const Card: React.FC<CardProps> = props => {
  const [loading, setLoading] = useState(false);
  const {merchant, style, update} = props;
  const [commonDispatcher] = useCommonDispatcher();
  const navigation = useNavigation() as FakeNavigation;

  const addMyPrivateSeas = async (id: number) => {
    try {
      setLoading(true);
      await api.merchant.drawMerchant(id);
      commonDispatcher.success('添加成功');
      update();
    } catch (error) {
      commonDispatcher.error((error as string) || '添加失败');
    }
    setLoading(false);
  };

  return (
    <>
      <Loading active={loading} />
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() =>
          navigation.navigate({
            name: 'AddMerchant',
            params: {
              action: MerchantAction.VIEW,
              publicId: merchant.id,
              identity: MerchantCreateType.PUBLIC_SEA,
            },
          })
        }>
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
          {merchant?.address && (
            <View style={[globalStyles.borderBottom, {paddingVertical: 16, flexDirection: 'row'}]}>
              <Icon name="environment" />
              <Text style={[globalStyles.fontSecondary, {flex: 1, marginLeft: 5}]}>{merchant?.address}</Text>
            </View>
          )}

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
              <Text style={[globalStyles.fontSecondary, styles.centerText]}>认证状态</Text>
              <Text style={[globalStyles.fontPrimary, styles.centerTextValue]}>{merchant?.hasAuth ? '是' : '否'}</Text>
            </View>
          </View>

          <PlusButton title="加入我的私海" onPress={() => addMyPrivateSeas(merchant.id)} style={{justifyContent: 'center', paddingVertical: 15}} />
        </View>
      </TouchableOpacity>
    </>
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
