// import moment from 'moment';
import {InputItem} from '@ant-design/react-native';
import React from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import {FormList, FormTitle, SectionGroup} from '../../../component';
import {SearchForm} from '../../../models';
import {defaultInputProps} from '../../../constants';

interface BaseProps {
  form: SearchForm;
  setField: (field: string, value: any) => void;
}

const Base: React.FC<BaseProps> = props => {
  const {form, setField} = props;
  // const [date, setDate] = React.useState(moment('2017-05-17 11:11:11'));
  return (
    <ScrollView style={styles.container}>
      <SectionGroup style={[{marginTop: 0}, styles.sectionGroupStyle]}>
        <FormTitle title="商家信息" />
        <FormList label="商家信息">
          <InputItem
            {...defaultInputProps}
            value={form.name}
            onChange={val => setField('name', val)}
            placeholder="请输入商家名称"
          />
        </FormList>
        <FormList label="商家信息" desc="限制每次只能选择一个的">
          <InputItem
            {...defaultInputProps}
            value={form.address}
            onChange={val => setField('address', val)}
            placeholder="请输入商家名称"
          />
        </FormList>
        <FormList
          label="商家信息"
          desc="限制每次只能选择一个的提示信息占位选择一个的提示信息占位"
          extra={<View style={{backgroundColor: '#6cf', height: 100}} />}>
          <View style={{backgroundColor: '#6cf'}}>
            <Text>请输入</Text>
          </View>
        </FormList>
        <FormList
          label="商家信息"
          desc="限制每次只能选择一个的提示信息占位选择一个的提示信息占位">
          <View style={{backgroundColor: '#6cf'}}>
            <Text>请输入</Text>
          </View>
        </FormList>
        {/* <DatePicker value={date} onChange={setDate} mode="datetime" /> */}
      </SectionGroup>
    </ScrollView>
  );
};
Base.defaultProps = {
  // title: 'Base',
};
export default Base;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionGroupStyle: {
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    paddingTop: 13,
  },
});
