import {Icon as AntdIcon, Popover} from '@ant-design/react-native';
import {useNavigation} from '@react-navigation/native';
import {useMount, useUnmount} from 'ahooks';
import React, {useState} from 'react';
import {View, Text, StyleSheet, FlatList, SafeAreaView} from 'react-native';
import {useSelector} from 'react-redux';
import {PlusButton} from '../../../component';
import Empty from '../../../component/Empty';
import Icon from '../../../component/Form/Icon';
// import Icon from '../../../component/Form/Icon';
import Loading from '../../../component/Loading';
import UnverifiedModal from '../../../component/UnverifiedModal';
import {globalStyles, globalStyleVariables} from '../../../constants/styles';
import {useMerchantDispatcher, useUserAuthInfo} from '../../../helper/hooks';
import {FakeNavigation, MerchantCreateType, MerchantAction, Options, MerchantF, ListLoadingType} from '../../../models';
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
  const [filterVal, setFilterVal] = useState<Options>(null);
  const {isShowAuthModal, onChangeAuthModal, userAuth} = useUserAuthInfo();
  const [merchantDispatcher] = useMerchantDispatcher();
  const [inputVal] = useState('');
  const merchantList = useSelector<RootState, MerchantList<MerchantF[]>>(state => state.merchant.merchantPublicList);
  const pageIndex = useSelector<RootState, number>(state => state.merchant?.merchantPublicList?.page?.pageIndex);
  const {pullDownLoading, pullUpLoading, searchLoading} = useSelector<RootState, ListLoadingType>(state => state.merchant.merchantPublicLoading);
  const navigation = useNavigation() as FakeNavigation;
  // const {run} = useDebounceFn(async (name: string) => {
  //   merchantDispatcher.loadPublicMerchantList({index: 0, name: name, replace: true});
  // });

  useMount(() => {
    if (merchantList) {
      merchantDispatcher.loadPublicMerchantList({
        index: 0,
        replace: true,
        loading: {
          pullDownLoading: false,
          pullUpLoading: false,
          searchLoading: true,
        },
      });
    }
  });

  useUnmount(() => {
    merchantDispatcher.exitMerchantPage();
  });

  const checkUserAuth = (callback: () => void) => {
    if (!userAuth) {
      onChangeAuthModal(true);
      return;
    }
    callback();
  };

  const onChangeFilter = (value: Options) => {
    setFilterVal(value);
    merchantDispatcher.loadPublicMerchantList({
      index: 0,
      replace: true,
      multiStore: value.value,
      loading: {
        pullDownLoading: false,
        pullUpLoading: false,
        searchLoading: true,
      },
    });
  };

  const updateMerchantList = () => {
    merchantDispatcher.loadPublicMerchantList({
      index: 0,
      replace: true,
      loading: {
        pullDownLoading: false,
        pullUpLoading: false,
        searchLoading: true,
      },
    });
    merchantDispatcher.loadPrivateMerchantList({
      index: 0,
      replace: true,
      loading: {
        pullDownLoading: false,
        pullUpLoading: false,
        searchLoading: true,
      },
    });
  };
  const pullUp = () => {
    merchantDispatcher.loadPublicMerchantList({
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
    merchantDispatcher.loadPublicMerchantList({
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
    <SafeAreaView style={[globalStyles.wrapper]}>
      <Loading active={searchLoading} />
      <View style={[styles.header, globalStyles.containerLR]}>
        <Text style={(globalStyles.moduleMarginLeft, {flex: 1})}>
          <Text style={globalStyles.fontPrimary}>共{merchantList?.page?.pageTotal || 0}家</Text>
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
              <Text>{filterVal?.label ? filterVal?.label : '筛选'}</Text>
              <AntdIcon name="caret-down" color="#030303" style={[{marginLeft: 7}, globalStyles.fontPrimary]} />
            </View>
          </Popover>
          <View style={globalStyles.dividingLine} />
          <Icon name="FYLM_all_search" color="#999999" />
          {/* <View style={globalStyles.dividingLine} /> */}
          {/* <View style={{width: 100}}>
            <Input
              placeholder="搜索"
              value={inputVal}
              extra={<Icon name="FYLM_all_search" color="#f4f4f4" />}
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
          style={[styles.createButton]}
          title="新增公海商家"
          onPress={() =>
            checkUserAuth(() =>
              navigation.navigate({
                name: 'AddMerchant',
                params: {
                  action: MerchantAction.ADD,
                  publicId: MerchantCreateType.PUBLIC_SEA,
                  identity: MerchantCreateType.PUBLIC_SEA,
                },
              }),
            )
          }
        />
      </View>
      <FlatList
        refreshing={pullUpLoading}
        onRefresh={pullUp}
        onEndReached={pullDown}
        ListFooterComponentStyle={[{height: 40}, globalStyles.containerCenter]}
        data={merchantList?.content}
        onEndReachedThreshold={0.3}
        renderItem={({item}) => <Card onUpdate={updateMerchantList} merchant={item} key={item.id} style={globalStyles.marginBottom} />}
        ListEmptyComponent={!searchLoading && <Empty text="还没有商家哦" icon={'shop'} />}
        ListFooterComponent={
          !!merchantList?.content?.length && <Text style={[{textAlign: 'center'}, globalStyles.fontTertiary]}>{pullDownLoading ? '加载中...' : '没有更多了哦'}</Text>
        }
      />
      <UnverifiedModal open={isShowAuthModal} onChangeOpen={onChangeAuthModal} />
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
