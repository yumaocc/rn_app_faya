import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import * as api from '../../../apis';
import {PlusButton} from '../../../component';
import {globalStyles} from '../../../constants/styles';
import {useHomeSummary, useLog} from '../../../helper/hooks';
import {MerchantF} from '../../../models';
import Card from './Card';

const PrivateSeaList: React.FC = () => {
  const [summary] = useHomeSummary();
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

  useLog(merchantList);

  return (
    <View style={style.container}>
      <View>
        <Text>
          我的私海
          <Text>{`${summary?.privateSeaNums || 0}/${
            summary?.privateSeaLimit || 0
          }`}</Text>
        </Text>
      </View>
      <View style={style.createButton}>
        <PlusButton title="新增私海商家" />
      </View>
      {merchantList.map(merchant => {
        return (
          <Card
            merchant={merchant}
            key={merchant.id}
            style={globalStyles.moduleMarginTop}
          />
        );
      })}
    </View>
  );
};
export default PrivateSeaList;

const style = StyleSheet.create({
  container: {
    padding: 16,
  },
  createButton: {
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    height: 40,
  },
});
