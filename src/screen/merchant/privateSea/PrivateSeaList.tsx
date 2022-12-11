import {useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import * as api from '../../../apis';
import {PlusButton} from '../../../component';
import {globalStyles, globalStyleVariables} from '../../../constants/styles';
import {useHomeSummary} from '../../../helper/hooks';
import {FakeNavigation, MerchantAction, MerchantCreateType, MerchantF} from '../../../models';
import Card from './Card';

const PrivateSeaList: React.FC = () => {
  const [summary] = useHomeSummary();
  const navigation = useNavigation() as FakeNavigation;
  const [merchantList, setMerchantList] = React.useState<MerchantF[]>([]);
  useEffect(() => {
    async function searchList() {
      const data = await api.merchant.getPrivateSeaMerchants({
        pageIndex: 1,
        pageSize: 10,
      });
      setMerchantList(data.content);
    }
    searchList();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={{marginLeft: 10}}>
          我的私海
          <Text>{`${summary?.privateSeaNums || 0}/${summary?.privateSeaLimit || 0}`}</Text>
        </Text>
      </View>
      <View style={{paddingHorizontal: globalStyleVariables.MODULE_SPACE}}>
        <PlusButton
          style={styles.createButton}
          title="新增私海商家"
          onPress={() => {
            navigation.navigate({
              name: 'AddMerchant',
              params: {
                type: MerchantCreateType.PRIVATE_SEA,
                action: MerchantAction.ADD,
              },
            });
          }}
        />
        <View>
          {merchantList.map(merchant => {
            return <Card merchant={merchant} key={merchant.id} style={globalStyles.moduleMarginTop} />;
          })}
        </View>
      </View>
    </ScrollView>
  );
};
export default PrivateSeaList;

const styles = StyleSheet.create({
  container: {
    // padding: 16,
  },
  header: {
    height: 45,
    // alignItems: 'center',
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
