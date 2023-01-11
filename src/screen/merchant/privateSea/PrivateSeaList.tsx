import {useNavigation} from '@react-navigation/native';
import {Icon as AntdIcon} from '@ant-design/react-native';
import Icon from '../../../component/Form/Icon';
import {useDebounceFn, useMount, useUnmount} from 'ahooks';
import React, {useState} from 'react';
import {View, Text, StyleSheet, SafeAreaView, FlatList} from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';

import {Input, PlusButton} from '../../../component';
import {globalStyles, globalStyleVariables} from '../../../constants/styles';
import {useHomeSummary, useMerchantDispatcher} from '../../../helper/hooks';
import {FakeNavigation, MerchantAction, MerchantCreateType, MerchantF, Options} from '../../../models';
import Card from './Card';
import Loading from '../../../component/Loading';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/reducers';
import {MerchantList} from '../../../models/merchant';
import Empty from '../../../component/Empty';
import {getLoadingStatusText} from '../../../helper/util';

const options = [
  {
    label: '单店',
    value: 1,
  },
  {
    label: '多店',
    value: 2,
  },
];

const PrivateSeaList: React.FC = () => {
  const [valueType, setValueType] = useState<Options>(null);
  const [merchantDispatcher] = useMerchantDispatcher();
  const merchantList = useSelector<RootState, MerchantList<MerchantF[]>>(state => state.merchant.merchantPrivateList);
  const pageIndex = useSelector<RootState, number>(state => state.merchant?.merchantPrivateList?.page?.pageIndex);
  const loading = useSelector<RootState, boolean>(state => state.merchant.merchantLoading);
  const [value, setValue] = useState('');
  const [summary] = useHomeSummary();
  const navigation = useNavigation() as FakeNavigation;

  const {run} = useDebounceFn(async (name: string) => {
    merchantDispatcher.loadPrivateMerchantList({index: 0, name: name, replace: true});
  });

  useMount(() => {
    merchantDispatcher.loadPrivateMerchantList({index: 0, replace: true});
  });

  useUnmount(() => {
    merchantDispatcher.exitMerchantPage();
  });

  const handleChangeFilter = (value: Options) => {
    setValueType(value);
    merchantDispatcher.loadPrivateMerchantList({index: 0, multiStore: value.value, replace: true});
  };

  return (
    <SafeAreaView style={[globalStyles.wrapper, styles.container]}>
      <Loading active={loading} />
      <View style={[styles.header]}>
        <Text style={(globalStyles.moduleMarginLeft, {flex: 1})}>
          我的私海&nbsp;
          <Text style={globalStyles.fontPrimary}>{`${summary?.privateSeaNums || 0}/${summary?.privateSeaLimit || 0}`}</Text>
        </Text>

        <View style={[{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}]}>
          <ModalDropdown
            dropdownStyle={[globalStyles.dropDownItem, {height: 80}]}
            renderRow={item => (
              <View style={[globalStyles.dropDownText]}>
                <Text>{item.label}</Text>
              </View>
            )}
            options={options}
            onSelect={(item, text) => handleChangeFilter(text as Options)}>
            <View style={{flexDirection: 'row'}}>
              {valueType?.label ? <Text>{valueType.label}</Text> : <Text>筛选</Text>}
              <AntdIcon name="caret-down" color="#030303" style={[{marginLeft: 7}, globalStyles.fontPrimary]} />
            </View>
          </ModalDropdown>
          <View style={styles.dividingLine} />
          <View style={{width: 100}}>
            <Input
              placeholder="搜索"
              value={value}
              extra={<Icon name="FYLM_all_search" color="#f4f4f4" />}
              onChange={e => {
                setValue(e);
                run(e);
              }}
              textAlign="left"
            />
          </View>
        </View>
      </View>

      <View>
        <PlusButton
          style={styles.createButton}
          title="新增私海商家"
          onPress={() => {
            navigation.navigate({
              name: 'AddMerchant',
              params: {
                identity: MerchantCreateType.PRIVATE_SEA,
                action: MerchantAction.ADD,
              },
            });
          }}
        />
      </View>

      <FlatList
        refreshing={false}
        data={merchantList?.content}
        renderItem={({item}) => <Card merchant={item} key={item.id} style={globalStyles.marginBottom} />}
        onRefresh={async () => {
          merchantDispatcher.loadPrivateMerchantList({pageIndex: 0, replace: true, pull: true});
        }}
        onEndReached={() => {
          merchantDispatcher.loadPrivateMerchantList({index: pageIndex, multiStore: valueType?.value, name: value, replace: false, pull: true});
        }}
        ListEmptyComponent={!loading && <Empty text="还没有商家哦，快去公海看看吧" icon={'shop'} />}
        ListFooterComponentStyle={[{height: 40}, globalStyles.containerCenter]}
        ListFooterComponent={
          !!merchantList?.content?.length && <Text style={[{textAlign: 'center'}, globalStyles.fontTertiary]}>{getLoadingStatusText(merchantList?.status)}</Text>
        }
      />
    </SafeAreaView>
  );
};
export default PrivateSeaList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  dividingLine: {
    width: 1,
    height: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    marginLeft: globalStyleVariables.MODULE_SPACE,
    marginRight: globalStyleVariables.MODULE_SPACE,
  },
  header: {
    width: '100%',
    height: 45,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingLeft: globalStyleVariables.MODULE_SPACE,
    paddingRight: globalStyleVariables.MODULE_SPACE,
  },
  createButton: {
    marginLeft: globalStyleVariables.MODULE_SPACE,
    marginRight: globalStyleVariables.MODULE_SPACE,
    marginTop: globalStyleVariables.MODULE_SPACE,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    height: 40,
  },
});
