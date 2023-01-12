import {useNavigation} from '@react-navigation/native';
import {Icon as AntdIcon, Popover} from '@ant-design/react-native';
// import Icon from '../../../component/Form/Icon';
import {useMount, useUnmount} from 'ahooks';
import React, {useState} from 'react';
import {View, Text, StyleSheet, SafeAreaView, FlatList} from 'react-native';

import {PlusButton} from '../../../component';
import {globalStyles, globalStyleVariables} from '../../../constants/styles';
import {useHomeSummary, useMerchantDispatcher, useUserAuthInfo} from '../../../helper/hooks';
import {FakeNavigation, ListLoadingType, MerchantAction, MerchantCreateType, MerchantF, Options} from '../../../models';
import Card from './Card';
import Loading from '../../../component/Loading';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/reducers';
import {MerchantList} from '../../../models/merchant';
import Empty from '../../../component/Empty';
import UnverifiedModal from '../../../component/UnverifiedModal';
import Icon from '../../../component/Form/Icon';

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
  const [filterVal, setFilterVal] = useState<Options>(null);
  const [inputVal] = useState('');

  const navigation = useNavigation() as FakeNavigation;
  const [merchantDispatcher] = useMerchantDispatcher();
  const [summary] = useHomeSummary();

  const merchantList = useSelector<RootState, MerchantList<MerchantF[]>>(state => state.merchant.merchantPrivateList);
  const pageIndex = useSelector<RootState, number>(state => state.merchant?.merchantPrivateList?.page?.pageIndex);
  const {pullDownLoading, pullUpLoading, searchLoading} = useSelector<RootState, ListLoadingType>(state => state.merchant.merchantPrivateLoading);

  const {isShowAuthModal, onChangeAuthModal, userAuth} = useUserAuthInfo();

  // const {run} = useDebounceFn(async (name: string) => {
  //   merchantDispatcher.loadPrivateMerchantList({index: 0, name: name, replace: true});
  // });

  useMount(() => {
    merchantDispatcher.loadPrivateMerchantList({
      index: 0,
      replace: true,
      loading: {
        pullDownLoading: false,
        pullUpLoading: false,
        searchLoading: true,
      },
    });
  });

  useUnmount(() => {
    merchantDispatcher.exitMerchantPage();
  });

  const onChangeFilter = (value: Options) => {
    setFilterVal(value);
    merchantDispatcher.loadPrivateMerchantList({
      index: 0,
      multiStore: value.value,
      replace: true,
      loading: {
        pullDownLoading: false,
        pullUpLoading: false,
        searchLoading: true,
      },
    });
  };

  const checkUserAuth = (callback: () => void) => {
    if (!userAuth) {
      onChangeAuthModal(true);
      return;
    }
    callback();
  };

  const pullUp = () => {
    merchantDispatcher.loadPrivateMerchantList({
      index: 0,
      replace: true,
      loading: {
        pullDownLoading: false,
        pullUpLoading: true,
        searchLoading: false,
      },
    });
  };

  const pullDown = () => {
    merchantDispatcher.loadPrivateMerchantList({
      index: pageIndex,
      multiStore: filterVal?.value,
      name: inputVal,
      replace: false,
      loading: {
        pullDownLoading: true,
        pullUpLoading: false,
        searchLoading: false,
      },
    });
  };

  return (
    <SafeAreaView style={[globalStyles.wrapper, styles.container]}>
      <Loading active={searchLoading} />
      <View style={[styles.header]}>
        <Text style={(globalStyles.moduleMarginLeft, {flex: 1})}>
          我的私海&nbsp;
          <Text style={globalStyles.fontPrimary}>{`${summary?.privateSeaNums || 0}/${summary?.privateSeaLimit || 0}`}</Text>
        </Text>

        <View style={[{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}]}>
          <Popover
            overlay={
              <>
                {options.map(item => (
                  <Popover.Item style={[{width: 80}]} key={item.label} value={item.value}>
                    <Text style={{textAlign: 'center'}}>{item.label}</Text>
                  </Popover.Item>
                ))}
              </>
            }
            triggerStyle={{paddingVertical: 6}}
            onSelect={node => {
              onChangeFilter(node);
            }}>
            <View style={[{flexDirection: 'row'}]}>
              <Text>{filterVal ? filterVal?.label : '筛选'}</Text>
              <AntdIcon name="caret-down" color="#030303" style={[{marginLeft: 7}, globalStyles.fontPrimary]} />
            </View>
          </Popover>
          <View style={styles.dividingLine} />
          <Icon name="FYLM_all_search" color="#999999" />
          {/* <View style={{width: 100}}>
            <Input
              placeholder="搜索"
              value={inputVal}
              extra={}
              onChange={e => {
                setInputVal(e);
                run(e);
              }}
              textAlign="left"
            />
          </View> */}
        </View>
      </View>

      <View>
        <PlusButton
          style={styles.createButton}
          title="新增私海商家"
          onPress={() =>
            checkUserAuth(() =>
              navigation.navigate({
                name: 'AddMerchant',
                params: {
                  identity: MerchantCreateType.PRIVATE_SEA,
                  action: MerchantAction.ADD,
                },
              }),
            )
          }
        />
      </View>

      <FlatList
        refreshing={pullUpLoading}
        data={merchantList?.content}
        renderItem={({item}) => <Card merchant={item} key={item.id} style={globalStyles.marginBottom} />}
        onRefresh={pullUp}
        onEndReached={pullDown}
        ListEmptyComponent={!searchLoading && <Empty text="还没有商家哦，快去公海看看吧" icon={'shop'} />}
        ListFooterComponentStyle={[{height: 40}, globalStyles.containerCenter]}
        ListFooterComponent={
          !!merchantList?.content?.length && <Text style={[{textAlign: 'center'}, globalStyles.fontTertiary]}>{pullDownLoading ? '加载中...' : '没有更多了哦'}</Text>
        }
      />

      <UnverifiedModal open={isShowAuthModal} onChangeOpen={onChangeAuthModal} />
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
