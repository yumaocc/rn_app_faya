import {Icon} from '@ant-design/react-native';
import {useNavigation} from '@react-navigation/native';
import {useRequest} from 'ahooks';
import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import * as api from '../../../apis';
import {Input, PlusButton} from '../../../component';
import {globalStyles, globalStyleVariables} from '../../../constants/styles';
import {FakeNavigation, MerchantCreateType, MerchantAction, Options} from '../../../models';
import Card from './Card';

const options = [
  {
    label: '单店',
    value: 0,
  },
  {
    label: '多店',
    value: 1,
  },
];
const PublicSeaList: React.FC = () => {
  const [valueType, setValueType] = useState<Options>(null);
  const [value, setValue] = useState('');
  const navigation = useNavigation() as FakeNavigation;
  const {data, run} = useRequest(async () => {
    return await api.merchant.getPublicSeaMerchants({
      pageIndex: 1,
      pageSize: 10,
    });
  });
  const handleChangeFilter = (value: Options) => {
    console.log(value);
    setValueType(value);
    // setPageIndex(1);
    // searchList(Action.other, 1);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.header, globalStyles.containerLR]}>
        <Text style={(globalStyles.moduleMarginLeft, {flex: 1})}>
          <Text style={globalStyles.fontPrimary}>共{data?.page?.pageTotal}家</Text>
        </Text>

        <View style={[{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}]}>
          <ModalDropdown
            dropdownStyle={[globalStyles.dropDownItem, {height: 80}]}
            renderRow={item => (
              <View style={[globalStyles.dropDownText]}>
                <Text>{item.label}</Text>
              </View>
            )}
            options={options}
            onSelect={(item, text) => handleChangeFilter(text as Options)}>
            <View style={{flexDirection: 'row'}}>
              {valueType?.label ? <Text>{valueType.label}</Text> : <Text>筛选</Text>}
              <Icon name="caret-down" color="#030303" style={[{marginLeft: 7}, globalStyles.fontPrimary]} />
            </View>
          </ModalDropdown>
          <View style={globalStyles.dividingLine} />
          <View>
            <Input
              placeholder="搜索"
              value={value}
              onChange={e => {
                setValue(e);
                // run(1);
                // setPageIndex(1);
              }}
              textAlign="left"
              style={{position: 'absolute', left: -10}}
            />
          </View>
        </View>
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
    backgroundColor: '#fff',
    paddingLeft: globalStyleVariables.MODULE_SPACE,
    paddingRight: globalStyleVariables.MODULE_SPACE,
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
