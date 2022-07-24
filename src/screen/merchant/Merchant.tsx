import {Tabs} from '@ant-design/react-native';
import React from 'react';
import {View, Text, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

const Merchant: React.FC = () => {
  const tabs = [{title: '私海商家'}, {title: '我的商家'}, {title: '公海商家'}];
  return (
    <SafeAreaView>
      <ScrollView>
        <View>
          <Tabs tabs={tabs}>
            <View>
              <Text>私海商家</Text>
            </View>
            <View>
              <Text>我的商家</Text>
            </View>
            <View>
              <Text>公海商家</Text>
            </View>
          </Tabs>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default Merchant;
