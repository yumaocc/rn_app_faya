// import {Tabs} from '@ant-design/react-native';
import React, {useEffect} from 'react';
import {View, Text, ScrollView, useWindowDimensions} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import PrivateSeaList from './privateSea/PrivateSeaList';
import MyList from './my/MyList';
import {Tabs} from '../../component';
const tabs = [
  {title: '私海商家', key: 'private'},
  {title: '我的商家', key: 'mine'},
  {title: '公海商家', key: 'public'},
];

const Merchant: React.FC = () => {
  const [currentTab, setCurrentTab] = React.useState('private');
  const scrollRef = React.useRef<ScrollView>(null);
  const windowSize = useWindowDimensions();
  useEffect(() => {
    const index = tabs.findIndex(item => item.key === currentTab);
    scrollRef.current?.scrollTo({
      x: windowSize.width * index,
      y: 0,
      animated: true,
    });
  }, [currentTab, windowSize.width]);
  return (
    <>
      <SafeAreaView style={{backgroundColor: '#fff', flex: 1}} edges={['top']}>
        <Tabs
          style={{borderBottomWidth: 0.3}}
          tabs={tabs}
          currentKey={currentTab}
          onChange={setCurrentTab}
        />
        <ScrollView
          style={{backgroundColor: '#f4f4f4'}}
          ref={scrollRef}
          horizontal
          snapToInterval={windowSize.width}
          scrollEnabled={false}>
          <View style={{width: windowSize.width}}>
            <PrivateSeaList />
          </View>
          <View style={{width: windowSize.width}}>
            <MyList />
          </View>
          <View style={{width: windowSize.width}}>
            <Text>公海商家</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};
export default Merchant;
