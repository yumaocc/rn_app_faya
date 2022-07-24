import React from 'react';
import {Text, View, ScrollView} from 'react-native';
// import {SafeAreaView} from 'react-native-safe-area-context';
import {Header} from '@react-navigation/elements';
// import {useUserDispatcher} from '../../../helper/hooks';
import {Icon} from '@ant-design/react-native';

const Home: React.FC = () => {
  return (
    <>
      <Header
        title="首页"
        headerLeft={() => <Icon name="bell" />}
        headerLeftContainerStyle={{paddingLeft: 16}}
      />
      <ScrollView
        style={{backgroundColor: '#f4f4f4'}}
        contentContainerStyle={{padding: 16}}>
        <View>
          <View>
            <Text>今日收益</Text>
            <Icon name="right" />
          </View>
        </View>
      </ScrollView>
    </>
  );
};
export default Home;
