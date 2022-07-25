import React, {useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import * as api from '../../../apis';
import {globalStyleVariables} from '../../../constants/styles';
import {MerchantF} from '../../../models';
import Card from './Card';

const PublicSeaList: React.FC = () => {
  const [merchantList, setMerchantList] = React.useState<MerchantF[]>([]);
  useEffect(() => {
    async function asyncFunc() {
      const res = await api.merchant.getPublicSeaMerchants({
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
        <Text>共{999}家</Text>
      </View>
      <View style={{paddingHorizontal: globalStyleVariables.MODULE_SPACE}}>
        <View>
          {merchantList.map(merchant => {
            return (
              <Card
                merchant={merchant}
                key={merchant.id}
                style={{marginTop: globalStyleVariables.MODULE_SPACE}}
              />
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
};
export default PublicSeaList;

const styles = StyleSheet.create({
  container: {},
  header: {
    height: 45,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
});
