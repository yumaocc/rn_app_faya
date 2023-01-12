import React, {useEffect, useState} from 'react';
import {TouchableOpacity, FlatList, Platform} from 'react-native';
import {FC} from 'react';
import {useMount} from 'ahooks';
import {Icon as AntdIcon, Popover} from '@ant-design/react-native';
import {NavigationBar} from '../../../component';
import {View, StyleSheet, Text} from 'react-native';
import {UnitNumber} from '../../../component';
import {globalStyleVariables, globalStyles} from '../../../constants/styles';
import {FakeNavigation, ContractAction, ContractStatus, ContractList as ContractListType, UserInfo} from '../../../models';
import {useNavigation} from '@react-navigation/native';
import {useContractDispatcher, useUserAuthInfo, useUserDispatcher} from '../../../helper/hooks';
// import Icon from '../../../component/Form/Icon';
import Loading from '../../../component/Loading';
import {cleanTime, getLoadingStatusText} from '../../../helper/util';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/reducers';
import {MerchantList} from '../../../models/merchant';
import Empty from '../../../component/Empty';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import UnverifiedModal from '../../../component/UnverifiedModal';

const ContractList: FC = () => {
  const [value] = useState('');
  const [contractDispatcher] = useContractDispatcher();
  const [userDispatcher] = useUserDispatcher();

  const userInfo = useSelector<RootState, UserInfo>(state => state.user.userInfo);
  const contractData = useSelector<RootState, MerchantList<ContractListType[]>>(state => state.contract.contractList);
  const loading = useSelector<RootState, boolean>(state => state.contract.contractLoading);
  // const {run} = useDebounceFn(async (name: string) => contractDispatcher.loadContractList({index: 0, name: name, replace: true, pull: false}), {
  //   wait: 500,
  // });
  const {bottom} = useSafeAreaInsets();
  const navigation = useNavigation() as FakeNavigation;

  const {isShowAuthModal, onChangeAuthModal, userAuth} = useUserAuthInfo();
  useEffect(() => {
    if (!userInfo) {
      userDispatcher.loadUserInfo();
    }
  }, [userDispatcher, userInfo]);

  useMount(() => {
    if (!contractData?.content?.length) {
      contractDispatcher.loadContractList({index: 0, replace: false, pull: true});
    }
  });

  const checkUserAuth = (callback: () => void) => {
    if (!userAuth) {
      onChangeAuthModal(true);
      return;
    }
    callback();
  };

  const headerRight = (
    <>
      <Popover
        overlay={
          <Popover.Item value={'test'}>
            <Text>新建合同</Text>
          </Popover.Item>
        }
        triggerStyle={{paddingVertical: 6}}
        onSelect={() =>
          checkUserAuth(() => {
            navigation.navigate('AddContract');
          })
        }>
        <View style={[{flexDirection: 'row'}]}>
          <AntdIcon name="plus-circle" style={[globalStyles.primaryColor, styles.headerIcon]} />
        </View>
      </Popover>
    </>
  );
  const getColor = (status: number) => {
    switch (status) {
      case ContractStatus.SignSuccess:
        return '#4AB87D';
      case ContractStatus.Resolved:
        return '#4AB87D';
      default:
        return '#999999';
    }
  };

  const renderItem = ({item}: {item: ContractListType}) => {
    return (
      <TouchableOpacity
        key={item.id}
        activeOpacity={0.5}
        style={{backgroundColor: '#fff', paddingLeft: globalStyleVariables.MODULE_SPACE, paddingRight: globalStyleVariables.MODULE_SPACE}}
        onPress={() => {
          navigation.navigate({
            name: 'ViewContract',
            params: {
              id: item.id,
              action: item.status === ContractStatus.SignSuccess ? ContractAction.VIEW : ContractAction.EDIT,
              status: item.status,
            },
          });
        }}>
        <View style={{marginTop: 10, paddingBottom: 10}}>
          <View>
            <Text style={[globalStyles.fontPrimary]}>{item?.name}</Text>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={[{color: getColor(item?.status)}, globalStyles.moduleMarginTop]}>
              {item?.statusStr}
              {cleanTime(item?.createdTime)}
            </Text>
            <Text>签约时间:{cleanTime(item?.createdTime)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <>
      <Loading active={loading} />
      <NavigationBar title="合同列表" headerRight={headerRight} />

      <View style={[globalStyles.lineHorizontal]} />
      <View style={[styles.header]}>
        <View>
          <UnitNumber prefix="共" value={contractData?.page?.pageTotal} unit="份" />
        </View>
        {/* <View style={{flexDirection: 'row', alignItems: 'center'}}>
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
        </View> */}
      </View>

      <FlatList
        data={contractData?.content}
        renderItem={renderItem}
        ListEmptyComponent={<Empty />}
        ListFooterComponentStyle={[{height: Platform.OS === 'ios' ? bottom * 2 : 40}, globalStyles.containerCenter]}
        ListFooterComponent={!!contractData?.content?.length && <Text style={[{textAlign: 'center'}, globalStyles.fontSize12]}>{getLoadingStatusText(contractData?.status)}</Text>}
        numColumns={1}
        refreshing={loading}
        onRefresh={() => {
          contractDispatcher.loadContractList({index: 0, name: value, replace: true, pull: true});
        }}
        onEndReached={() => {
          contractDispatcher.loadContractList({index: contractData?.page?.pageIndex, name: value, replace: false, pull: true});
        }}
      />
      <UnverifiedModal open={isShowAuthModal} onChangeOpen={onChangeAuthModal} />
    </>
  );
};
const styles = StyleSheet.create({
  contract: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  freshHeader: {
    height: 40,
  },
  headerIcon: {
    fontSize: 25,
    color: 'black',
    marginRight: globalStyleVariables.MODULE_SPACE,
  },
  content: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: '#fff',
  },
  contract_dot: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: globalStyleVariables.BORDER_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: globalStyleVariables.MODULE_SPACE,
  },
  list: {
    marginTop: globalStyleVariables.MODULE_SPACE,
    backgroundColor: '#fff',
    flex: 1,
  },
  header: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingLeft: globalStyleVariables.MODULE_SPACE,
    paddingRight: globalStyleVariables.MODULE_SPACE,
    marginBottom: globalStyleVariables.MODULE_SPACE,
  },
});

export default ContractList;
