import React, {useState} from 'react';
import {FC} from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {Icon, InputItem} from '@ant-design/react-native';
import {PlusButton} from '../../../../../component';
import * as api from '../../../../../apis';
import {globalStyles, globalStyleVariables} from '../../../../../constants/styles';
import {MerchantBookingModelF} from '../../../../../models';
import {Modal} from '../../../../../component';
import {useCommonDispatcher, useMerchantBookingModel} from '../../../../../helper/hooks';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';

interface ModuleProps {
  id: number;
}
const Module: FC<ModuleProps> = ({id}) => {
  const [modelName, setModelName] = useState('');
  const [isShow, setIsShow] = useState(false);
  const [bookingModels, reloadModels] = useMerchantBookingModel(id);
  const [commonDispatcher] = useCommonDispatcher();
  async function handleDelete(model: MerchantBookingModelF) {
    try {
      await api.merchant.deleteMerchantBookingModel(model.id);
      commonDispatcher.success('删除成功');
      reloadModels();
    } catch (error) {
      commonDispatcher.error(error);
    }
  }

  async function handleCreate() {
    if (!modelName) {
      setIsShow(false);
      return commonDispatcher.error('请输入预约型号名称');
    }
    try {
      await api.merchant.addMerchantBookingModel(modelName, id);
      commonDispatcher.success('创建成功!');
      setModelName('');
      reloadModels();
    } catch (error) {
      commonDispatcher.error(error);
    }
    setIsShow(false);
  }

  return (
    <SafeAreaView style={globalStyles.wrapper}>
      <View style={[styles.wrapper]}>
        <PlusButton title="创建预约型号" onPress={() => setIsShow(true)} />
        <View style={globalStyles.moduleMarginTop}>
          <Text style={globalStyles.fontPrimary}>共{bookingModels?.length || 0}个型号</Text>
        </View>
        <ScrollView style={{flex: 1}}>
          {bookingModels?.map(item => {
            return (
              <View key={item.id} style={[globalStyles.borderBottom, styles.box, globalStyles.moduleMarginTop, globalStyles.containerLR]}>
                <Text>{item.name}</Text>
                <TouchableOpacity activeOpacity={0.5} onPress={() => handleDelete(item)}>
                  <Icon name="minus-circle" style={[{color: 'red'}]} />
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
        <Modal title="穿件预约型号" visible={isShow} onClose={() => setIsShow(false)} onOk={handleCreate}>
          <InputItem placeholder="请输入型号名称" value={modelName} onChangeText={text => setModelName(text)} />
        </Modal>
      </View>
      <View style={[globalStyles.containerCenter, {margin: globalStyleVariables.MODULE_SPACE}]}>
        <Text style={globalStyles.fontTertiary}>已经到底了</Text>
      </View>
    </SafeAreaView>
  );
};
export default Module;

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#fff',
    padding: globalStyleVariables.MODULE_SPACE,
  },
  box: {
    padding: globalStyleVariables.MODULE_SPACE,
    backgroundColor: '#f4f4f4',
  },
});
