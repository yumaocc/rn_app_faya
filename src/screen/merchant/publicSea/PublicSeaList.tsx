import {Icon as AntdIcon} from '@ant-design/react-native';
import {useNavigation} from '@react-navigation/native';
import {useDebounceFn} from 'ahooks';
import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, SafeAreaView} from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import {useSelector} from 'react-redux';
import {Input, PlusButton} from '../../../component';
import Icon from '../../../component/Form/Icon';
import Loading from '../../../component/Loading';
import {PAGE_SIZE} from '../../../constants';
import {globalStyles, globalStyleVariables} from '../../../constants/styles';
import {useMerchantDispatcher} from '../../../helper/hooks';
import {FakeNavigation, MerchantCreateType, MerchantAction, Options, MerchantF, RequestAction, PagedData} from '../../../models';
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
  const merchantList = useSelector<RootState, PagedData<MerchantF[]>>(state => state.merchant.merchantList);
  const pageIndex = useSelector<RootState, number>(state => state.merchant?.merchantList?.page?.pageIndex);
  const loading = useSelector<RootState, boolean>(state => state.merchant.merchantLoading);
  const navigation = useNavigation() as FakeNavigation;
  const {run} = useDebounceFn(async (name: string) => {
    merchantDispatcher.loadPublicMerchantList({pageIndex: 1, pageSize: PAGE_SIZE, name: name, action: RequestAction.other});
  });

  useEffect(() => {
    if (!merchantList?.content?.length) {
      merchantDispatcher.loadPublicMerchantList({pageIndex: 1, pageSize: PAGE_SIZE, action: RequestAction.load});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangeFilter = (value: Options) => {
    setValueType(value);
    merchantDispatcher.loadPublicMerchantList({pageIndex: 1, pageSize: PAGE_SIZE, action: RequestAction.other, multiStore: value.value});
  };

  return (
    <SafeAreaView style={[globalStyles.wrapper, styles.container]}>
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
      <View style={{paddingHorizontal: globalStyleVariables.MODULE_SPACE}}>
        <PlusButton
          style={[styles.createButton, {marginBottom: globalStyleVariables.MODULE_SPACE}]}
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
          merchantDispatcher.loadPublicMerchantList({pageIndex: 1, pageSize: PAGE_SIZE, multiStore: valueType?.value, name: value, action: RequestAction.other});
        }}
        data={merchantList?.content}
        renderItem={({item}) => (
          <Card
            update={() => merchantDispatcher.loadPublicMerchantList({pageIndex: 1, pageSize: PAGE_SIZE, multiStore: valueType?.value, name: value, action: RequestAction.other})}
            merchant={item}
            key={item.id}
            style={globalStyles.moduleMarginTop}
          />
        )}
        onEndReached={() => {
          merchantDispatcher.loadPublicMerchantList({pageIndex: pageIndex + 1, pageSize: PAGE_SIZE, multiStore: valueType?.value, name: value, action: RequestAction.load});
        }}
        ListFooterComponent={
          <View style={[globalStyles.containerCenter, {flex: 1, marginTop: globalStyleVariables.MODULE_SPACE, marginBottom: globalStyleVariables.MODULE_SPACE}]}>
            <Text style={[globalStyles.fontTertiary, {textAlign: 'center'}]}>已经到底</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};
export default PublicSeaList;

const styles = StyleSheet.create({
  container: {},
  header: {
    height: 45,
    backgroundColor: '#fff',
    paddingLeft: globalStyleVariables.MODULE_SPACE,
    paddingRight: globalStyleVariables.MODULE_SPACE,
  },
  createButton: {
    marginTop: globalStyleVariables.MODULE_SPACE,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    height: 40,
  },
});
