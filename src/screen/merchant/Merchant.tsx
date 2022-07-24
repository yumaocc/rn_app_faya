// import {Tabs} from '@ant-design/react-native';
import React from 'react';
import {View, Text, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import PrivateSeaList from './privateSea/PrivateSeaList';
import {Tabs} from '../../component';

const Merchant: React.FC = () => {
  const [currentTab, setCurrentTab] = React.useState('private');
  const tabs = [
    {
      title: '私海商家',
      key: 'private',
    },
    {
      title: '我的商家',
      key: 'mine',
    },
    {
      title: '公海商家',
      key: 'public',
    },
  ];
  return (
    <>
      <SafeAreaView style={{backgroundColor: '#fff', flex: 1}} edges={['top']}>
        <Tabs
          style={{borderBottomWidth: 0.3}}
          tabs={tabs}
          currentKey={currentTab}
          onChange={setCurrentTab}
        />
        <ScrollView style={{backgroundColor: '#f4f4f4', flex: 1}}>
          <View>
            <View>
              <PrivateSeaList />
            </View>
            <View>
              <Text>我的商家</Text>
            </View>
            <View>
              <Text>公海商家</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};
export default Merchant;
