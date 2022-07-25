import React from 'react';
import {View, Text} from 'react-native';
import {useParams} from '../../helper/hooks';
import {MerchantCreateType} from '../../models';

const AddMerchant: React.FC = () => {
  const params = useParams<{type: MerchantCreateType}>();
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>
        {params.type === MerchantCreateType.PRIVATE_SEA
          ? '新建私海'
          : '新建公海'}
      </Text>
    </View>
  );
};
export default AddMerchant;
