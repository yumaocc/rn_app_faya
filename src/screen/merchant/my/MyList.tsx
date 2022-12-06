import React, {useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import * as api from '../../../apis';
import {globalStyleVariables} from '../../../constants/styles';
import {MyMerchantF} from '../../../models';
import Card from './Card';

const MyList: React.FC = () => {
  const [merchantList, setMerchantList] = React.useState<MyMerchantF[]>([]);
  useEffect(() => {
    async function asyncFunc() {
      const res = await api.merchant.getMyMerchants({
        pageIndex: 1,
        pageSize: 10,
      });
      console.log(res);
      setMerchantList(res.content);
    }
    asyncFunc();
  }, []);
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text>共{25}家</Text>
      </View>
      <View style={{paddingHorizontal: globalStyleVariables.MODULE_SPACE}}>
        <View>
          {merchantList.map(merchant => {
            return <Card merchant={merchant} key={merchant.id} style={{marginTop: globalStyleVariables.MODULE_SPACE}} />;
          })}
        </View>
      </View>
    </ScrollView>
  );
};
export default MyList;

const styles = StyleSheet.create({
  container: {},
  header: {
    height: 45,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
});
