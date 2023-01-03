import React, {useEffect, useState} from 'react';
import {FC} from 'react';
import {StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {NavigationBar, Tabs} from '../../../../component';
import {globalStyles, globalStyleVariables} from '../../../../constants/styles';
import {useParams, useRefCallback} from '../../../../helper/hooks';
import ContractList from './ContractList';
import ShopInfo from './ShopInfo';
import Module from './Module';
import {SafeAreaView} from 'react-native-safe-area-context';
const tabs = [
  {title: '合同列表', key: 'contract'},
  {title: '商家信息', key: 'shop'},
  {title: '型号管理', key: 'module'},
];
const MyMerchantDetail: FC = () => {
  const [ref, setRef, isReady] = useRefCallback<ScrollView>();
  const {width: windowWidth} = useWindowDimensions();
  const {id, name, status, from, locationCompanyId} = useParams<{id: number; name: string; status: string; from: string; locationCompanyId: number}>();
  const [currentKey, setCurrentKey] = useState('contract');
  // 自动切换到指定step
  useEffect(() => {
    if (!isReady) {
      return;
    }
    const index = tabs.findIndex(item => item.key === currentKey);
    setTimeout(() => {
      ref.current?.scrollTo({
        x: windowWidth * index,
        y: 0,
        animated: true,
      });
    }, 0);
  }, [currentKey, isReady, ref, windowWidth]);
  useEffect(() => {
    if (from) {
      setCurrentKey(from);
    }
  }, [from]);
  return (
    <>
      <SafeAreaView style={style.container} edges={['bottom']}>
        <NavigationBar
          title={
            <View style={[style.header]}>
              <Text style={{marginBottom: 5}}>{name}</Text>
              {!!status ? <Text style={[globalStyles.tagGreen]}>·合作中</Text> : <Text style={globalStyles.tag}>·即将调入公海</Text>}
            </View>
          }
        />

        <Tabs tabs={tabs} topBorder underline currentKey={currentKey} onChange={setCurrentKey} style={{backgroundColor: '#fff'}} />

        <ScrollView style={{backgroundColor: globalStyleVariables.COLOR_PAGE_BACKGROUND}} ref={setRef} horizontal snapToInterval={windowWidth} scrollEnabled={false}>
          <View style={{width: windowWidth}}>
            <ContractList id={id} />
          </View>
          <View style={{width: windowWidth}}>
            <ScrollView>
              <ShopInfo id={id} locationCompanyId={locationCompanyId} />
            </ScrollView>
          </View>
          <View style={{width: windowWidth}}>
            <ScrollView>
              <Module id={id} />
            </ScrollView>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default MyMerchantDetail;
const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
  },
  wrapper: {
    margin: globalStyleVariables.MODULE_SPACE,
    backgroundColor: '#fff',
  },
});
