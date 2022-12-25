import {Icon} from '@ant-design/react-native';
import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import * as api from '../../../apis';
import {Input} from '../../../component';
import {globalStyles, globalStyleVariables} from '../../../constants/styles';
import {MyMerchantF, Options} from '../../../models';
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
const MyList: React.FC = () => {
  const [merchantList, setMerchantList] = React.useState<MyMerchantF[]>([]);
  const [valueType, setValueType] = useState<Options>(null);
  const [value, setValue] = useState('');
  const [account, setAccount] = useState(0);
  useEffect(() => {
    async function asyncFunc() {
      const res = await api.merchant.getMyMerchants({
        pageIndex: 1,
        pageSize: 10,
      });
      setAccount(res.page.pageTotal);
      setMerchantList(res.content);
    }
    asyncFunc();
  }, []);

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
          <Text style={globalStyles.fontPrimary}>共{account}家</Text>
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
        <View>
          {merchantList.map(merchant => {
            return <Card merchant={merchant} key={merchant.id} style={{marginTop: globalStyleVariables.MODULE_SPACE}} />;
          })}
        </View>
      </View>
    </ScrollView>
  );
};
export default MyList;

const styles = StyleSheet.create({
  container: {},
  header: {
    height: 45,
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingLeft: globalStyleVariables.MODULE_SPACE,
    paddingRight: globalStyleVariables.MODULE_SPACE,
  },
});
