// import moment from 'moment';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {FormList, FormTitle, SectionGroup} from '../../../component';

interface BaseProps {
  title?: string;
}

const Base: React.FC<BaseProps> = () => {
  // const [date, setDate] = React.useState(moment('2017-05-17 11:11:11'));
  return (
    <View style={styles.container}>
      <SectionGroup style={[{marginTop: 0}, styles.sectionGroupStyle]}>
        <FormTitle title="商家信息" />
        <FormList label="商家信息">
          <View style={{backgroundColor: '#6cf'}}>
            <Text>请输入</Text>
          </View>
        </FormList>
        <FormList label="商家信息" desc="限制每次只能选择一个的提示信息占位">
          <View style={{backgroundColor: '#6cf'}}>
            <Text>请输入</Text>
          </View>
        </FormList>
        <FormList
          label="商家信息"
          desc="限制每次只能选择一个的提示信息占位"
          extra={<View style={{backgroundColor: '#6cf', height: 100}} />}>
          <View style={{backgroundColor: '#6cf'}}>
            <Text>请输入</Text>
          </View>
        </FormList>
        {/* <DatePicker value={date} onChange={setDate} mode="datetime" /> */}
      </SectionGroup>
    </View>
  );
};
Base.defaultProps = {
  title: 'Base',
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
