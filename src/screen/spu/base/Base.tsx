// import moment from 'moment';
import {InputItem, Button} from '@ant-design/react-native';
import React from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import {DatePicker, FormTitle, SectionGroup, Form} from '../../../component';
import {DATE_TIME_FORMAT, defaultInputProps} from '../../../constants';

interface BaseProps {
  toDelete?: string; // delete me after
}

const Base: React.FC<BaseProps> = () => {
  const form = Form.useFormInstance();
  return (
    <ScrollView style={styles.container}>
      <Button
        onPress={() => {
          console.log(form.getFieldsValue());
        }}>
        检查
      </Button>
      <SectionGroup style={[{marginTop: 0}, styles.sectionGroupStyle]}>
        <FormTitle title="商家信息" />
        <Form.Item label="商家信息" name="name">
          <InputItem {...defaultInputProps} placeholder="请输入商家名称" />
        </Form.Item>
        {/* <Form.Item label="商家信息" desc="限制每次只能选择一个的">
            <InputItem {...defaultInputProps} placeholder="请输入商家名称" />
          </Form.Item> */}
        {/* <Form.Item
            label="商家信息"
            desc="限制每次只能选择一个的提示信息占位选择一个的提示信息占位"
            extra={<View style={{backgroundColor: '#6cf', height: 100}} />}>
            <View style={{backgroundColor: '#6cf'}}>
              <Text>请输入</Text>
            </View>
          </Form.Item> */}
        {/* <Form.Item
            label="开始时间"
            extra={<View style={{backgroundColor: '#6cf', height: 100}} />}>
            <DatePicker value={date} onChange={setDate} mode="datetime">
              <Text>{date.format(DATE_TIME_FORMAT)}</Text>
            </DatePicker>
          </Form.Item> */}
        {/* <Form.Item
            label="商家信息"
            desc="限制每次只能选择一个的提示信息占位选择一个的提示信息占位">
            <View style={{backgroundColor: '#6cf'}}>
              <Text>请输入</Text>
            </View>
          </Form.Item> */}
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
