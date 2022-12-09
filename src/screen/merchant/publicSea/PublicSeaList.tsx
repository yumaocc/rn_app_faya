import {useNavigation} from '@react-navigation/native';
import {useRequest} from 'ahooks';
import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import * as api from '../../../apis';
import {PlusButton} from '../../../component';
import {globalStyleVariables} from '../../../constants/styles';
import {FakeNavigation, MerchantCreateType, MerchantAction} from '../../../models';
import Card from './Card';

const PublicSeaList: React.FC = () => {
  const navigation = useNavigation() as FakeNavigation;
  const {data, run} = useRequest(async () => {
    return await api.merchant.getPublicSeaMerchants({
      pageIndex: 1,
      pageSize: 10,
    });
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text>共{data?.page?.pageTotal}家</Text>
      </View>
      <View style={{paddingHorizontal: globalStyleVariables.MODULE_SPACE}}>
        <PlusButton
          style={styles.createButton}
          title="新增公海商家"
          onPress={() => {
            navigation.navigate({
              name: 'AddMerchant',
              params: {
                action: MerchantAction.ADD,
                publicId: MerchantCreateType.PUBLIC_SEA,
                identity: MerchantCreateType.PUBLIC_SEA,
              },
            });
          }}
        />
        <View>
          {data?.content?.map(merchant => {
            return <Card update={run} merchant={merchant} key={merchant.id} style={{marginTop: globalStyleVariables.MODULE_SPACE}} />;
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
    paddingLeft: 20,
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
