// import {Tabs} from '@ant-design/react-native';
import React, {useEffect} from 'react';
import {View, ScrollView, useWindowDimensions} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import PrivateSeaList from './privateSea/PrivateSeaList';
import PublicSeaList from './publicSea/PublicSeaList';
import MyList from './my/MyList';
import {Tabs} from '../../component';
import {useRefCallback} from '../../helper/hooks';
import {globalStyleVariables} from '../../constants/styles';
const tabs = [
  {title: '私海商家', key: 'private'},
  {title: '我的商家', key: 'mine'},
  {title: '公海商家', key: 'public'},
];

const Merchant: React.FC = () => {
  const [currentTab, setCurrentTab] = React.useState('private');
  const windowSize = useWindowDimensions();
  const [ref, setRef, isReady] = useRefCallback<ScrollView>();

  useEffect(() => {
    if (!isReady) {
      return;
    }
    const index = tabs.findIndex(item => item.key === currentTab);
    setTimeout(() => {
      ref.current?.scrollTo({
        x: windowSize.width * index,
        y: 0,
        animated: true,
      });
    }, 0);
  }, [currentTab, windowSize.width, isReady, ref]);

  return (
    <>
      <SafeAreaView style={{backgroundColor: '#fff', flex: 1}} edges={['top']}>
        <Tabs style={{borderBottomWidth: 0.3}} tabs={tabs} currentKey={currentTab} onChange={setCurrentTab} />
        <ScrollView style={{backgroundColor: globalStyleVariables.COLOR_PAGE_BACKGROUND}} ref={setRef} horizontal snapToInterval={windowSize.width} scrollEnabled={false}>
          <View style={{width: windowSize.width}}>
            <PrivateSeaList />
          </View>
          <View style={{width: windowSize.width}}>
            <MyList />
          </View>
          <View style={{width: windowSize.width}}>
            <PublicSeaList />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};
export default Merchant;
