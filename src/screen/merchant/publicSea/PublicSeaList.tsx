import {useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import * as api from '../../../apis';
import {PlusButton} from '../../../component';
import {globalStyleVariables} from '../../../constants/styles';
import {FakeNavigation, MerchantCreateType, MerchantF} from '../../../models';
import Card from './Card';

const PublicSeaList: React.FC = () => {
  const [merchantList, setMerchantList] = React.useState<MerchantF[]>([]);
  const navigation = useNavigation() as FakeNavigation;
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
        <PlusButton
          style={styles.createButton}
          title="新增公海商家"
          onPress={() => {
            navigation.navigate({
              name: 'AddMerchant',
              params: {
                type: MerchantCreateType.PUBLIC_SEA,
              },
            });
          }}
        />
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
  createButton: {
    marginTop: globalStyleVariables.MODULE_SPACE,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    height: 40,
  },
});
