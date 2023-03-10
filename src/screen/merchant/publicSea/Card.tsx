import {Icon} from '@ant-design/react-native';
import React, {useState} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
// import {BadgeFlag} from '../../../component';
import Loading from '../../../component/Loading';
import {useCommonDispatcher, useSummaryDispatcher} from '../../../helper/hooks';
import * as api from '../../../apis';
import {globalStyles, globalStyleVariables} from '../../../constants/styles';
import {BoolEnum, FakeNavigation, MerchantAction, MerchantCreateType, MerchantF, StylePropView} from '../../../models';
import {useNavigation} from '@react-navigation/native';
import {cleanTime} from '../../../helper/util';
import LinkButton from '../../../component/LinkButton';

interface CardProps {
  merchant: MerchantF;
  style?: StylePropView;
  onUpdate: () => void;
}

const Card: React.FC<CardProps> = props => {
  const [loading, setLoading] = useState(false);
  const {merchant, style, onUpdate} = props;
  const [commonDispatcher] = useCommonDispatcher();
  const [summaryDispatcher] = useSummaryDispatcher();
  const navigation = useNavigation() as FakeNavigation;

  const addMyPrivateSeas = async (id: number) => {
    try {
      setLoading(true);
      await api.merchant.drawMerchant(id);
      summaryDispatcher.loadHome();
      commonDispatcher.success('添加成功');
      onUpdate();
    } catch (error) {
      commonDispatcher.error((error as string) || '添加失败');
    }
    setLoading(false);
  };

  return (
    <View style={[globalStyles.marginRightLeft]}>
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
              locationCompanyId: merchant?.locationCompanyId,
              status: merchant?.hasAuth,
            },
          })
        }>
        <View style={[styles.container, style]}>
          <View style={[styles.header, globalStyles.borderBottom]}>
            <View style={[styles.logo]}>
              <Image source={{uri: merchant?.avatar || 'https://fakeimg.pl/100'}} style={{width: 40, height: 40, borderRadius: 5}} />
            </View>
            <View style={[globalStyles.moduleMarginLeft]}>
              <View>
                <View style={[globalStyles.flexNormal, {justifyContent: 'space-between'}]}>
                  <View style={{flex: 1, flexDirection: 'row', marginBottom: globalStyleVariables.MODULE_SPACE, alignItems: 'center'}}>
                    <Icon name="shop" color={'black'} />
                    <Text style={[globalStyles.textColorPrimary, styles.merchantName, {flex: 1}, globalStyles.moduleMarginLeft]} numberOfLines={1}>
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

              <View
                style={[
                  globalStyles.moduleMarginTop,
                  {
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingBottom: 5,
                  },
                ]}>
                <Text style={[globalStyles.fontSize12]}>{merchant.multiStore === BoolEnum.TRUE ? '多店' : '单店'}</Text>
                <View style={globalStyles.dividingLine} />
                <Text style={[globalStyles.fontSize12]}>{merchant?.hasAuth ? <Text style={{color: '#4AB87D'}}>已认证</Text> : <Text style={{color: '#999999'}}>未认证</Text>}</Text>
                <View style={globalStyles.dividingLine} />
                <Text style={[globalStyles.fontSize12]}>{cleanTime(merchant?.createdTime)}录入</Text>
              </View>
            </View>
          </View>
          {merchant?.address && (
            <View style={[globalStyles.borderBottom, {paddingVertical: 16, flexDirection: 'row'}]}>
              <Icon name="environment" />
              <Text style={[globalStyles.fontSecondary, {flex: 1, marginLeft: 5}]}>{merchant?.address}</Text>
            </View>
          )}

          <LinkButton fontSize={[globalStyles.fontPrimary, globalStyles.primaryColor]} title="加入我的私海" onPress={() => addMyPrivateSeas(merchant.id)} />
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
