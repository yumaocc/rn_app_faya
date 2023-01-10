import {Icon as AntdIcon} from '@ant-design/react-native';
import {useNavigation} from '@react-navigation/native';
import {useDebounceFn, useMount, useUnmount} from 'ahooks';
import React, {useState} from 'react';
import {View, Text, StyleSheet, FlatList, SafeAreaView} from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import {useSelector} from 'react-redux';
import {Input, PlusButton} from '../../../component';
import Empty from '../../../component/Empty';
import Icon from '../../../component/Form/Icon';
import Loading from '../../../component/Loading';
import {globalStyles, globalStyleVariables} from '../../../constants/styles';
import {useMerchantDispatcher} from '../../../helper/hooks';
import {getLoadingStatusText} from '../../../helper/util';
import {FakeNavigation, MerchantCreateType, MerchantAction, Options, MerchantF} from '../../../models';
import {MerchantList} from '../../../models/merchant';
import {RootState} from '../../../redux/reducers';
import Card from './Card';

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

const PublicSeaList: React.FC = () => {
  const [valueType, setValueType] = useState<Options>(null);
  const [merchantDispatcher] = useMerchantDispatcher();
  const [value, setValue] = useState('');
  const merchantList = useSelector<RootState, MerchantList<MerchantF[]>>(state => state.merchant.merchantPublicList);
  const pageIndex = useSelector<RootState, number>(state => state.merchant?.merchantPublicList?.page?.pageIndex);
  const loading = useSelector<RootState, boolean>(state => state.merchant.merchantLoading);
  const navigation = useNavigation() as FakeNavigation;
  console.log('公海列表', merchantList);
  const {run} = useDebounceFn(async (name: string) => {
    merchantDispatcher.loadPublicMerchantList({index: 0, name: name, replace: true});
  });

  useMount(() => {
    if (merchantList) {
      merchantDispatcher.loadPublicMerchantList({index: 0, replace: true});
    }
  });

  useUnmount(() => {
    merchantDispatcher.exitMerchantPage();
  });

  const handleChangeFilter = (value: Options) => {
    setValueType(value);
    merchantDispatcher.loadPublicMerchantList({index: 0, replace: true, multiStore: value.value});
  };

  const update = () => {
    merchantDispatcher.loadPublicMerchantList({index: 0, multiStore: valueType?.value, name: value, replace: true});
    merchantDispatcher.loadPrivateMerchantList({index: 0, replace: true});
  };

  return (
    <SafeAreaView style={[globalStyles.wrapper]}>
      <Loading active={loading} />
      <View style={[styles.header, globalStyles.containerLR]}>
        <Text style={(globalStyles.moduleMarginLeft, {flex: 1})}>
          <Text style={globalStyles.fontPrimary}>共{merchantList?.page?.pageTotal || 0}家</Text>
        </Text>

        <View style={[{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}]}>
          <ModalDropdown
            dropdownStyle={[globalStyles.dropDownItem, {height: 80, width: 100}]}
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
          <View style={globalStyles.dividingLine} />
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
      <View style={{marginBottom: globalStyleVariables.MODULE_SPACE}}>
        <PlusButton
          style={[styles.createButton]}
          title="新增公海商家"
          onPress={() => {
            navigation.navigate({
              name: 'AddMerchant',
              params: {
                action: MerchantAction.ADD,
                publicId: MerchantCreateType.PUBLIC_SEA,
                identity: MerchantCreateType.PUBLIC_SEA,
              },
            });
          }}
        />
      </View>
      <FlatList
        refreshing={false}
        onRefresh={() => {
          merchantDispatcher.loadPublicMerchantList({index: 1, multiStore: valueType?.value, name: value, replace: true, pull: true});
        }}
        onEndReached={() => {
          merchantDispatcher.loadPublicMerchantList({index: pageIndex, multiStore: valueType?.value, name: value, replace: false, pull: true});
        }}
        ListFooterComponentStyle={[{height: 40}, globalStyles.containerCenter]}
        data={merchantList?.content}
        onEndReachedThreshold={0.3}
        renderItem={({item}) => <Card update={update} merchant={item} key={item.id} style={globalStyles.marginBottom} />}
        ListEmptyComponent={!loading && <Empty text="还没有商家哦" icon={'shop'} />}
        ListFooterComponent={
          !!merchantList?.content?.length && <Text style={[{textAlign: 'center'}, globalStyles.fontTertiary]}>{getLoadingStatusText(merchantList?.status)}</Text>
        }
      />
    </SafeAreaView>
  );
};
export default PublicSeaList;

const styles = StyleSheet.create({
  header: {
    height: 45,
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
