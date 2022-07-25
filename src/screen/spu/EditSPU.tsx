import React from 'react';
import {View, Text} from 'react-native';
import {useParams} from '../../helper/hooks';

const EditSPU: React.FC = () => {
  const params = useParams<{id: number}>();
  const isEdit = params.id !== undefined;
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      {isEdit && <Text>编辑SPU, SPU ID： {params.id}</Text>}
      {!isEdit && <Text>新增SPU</Text>}
    </View>
  );
};
export default EditSPU;
