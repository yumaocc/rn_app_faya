import React from 'react';
import {View, Text} from 'react-native';
import {useParams} from '../../helper/hooks';

const EditContract: React.FC = () => {
  const params = useParams<{id: number}>();
  const isEdit = params.id !== undefined;
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      {isEdit && <Text>编辑合同, 合同ID： {params.id}</Text>}
      {!isEdit && <Text>新增合同</Text>}
    </View>
  );
};
export default EditContract;
