import React from 'react';
import {StyleSheet} from 'react-native';
import {SectionGroup, FormTitle, Form, Input} from '../../../component';
import Upload from '../../../component/Form/Upload';

const EditBase: React.FC = () => {
  return (
    <>
      <SectionGroup style={styles.sectionGroup}>
        <FormTitle title="基本信息" />
        <Form.Item label="商家LOGO" vertical desc="大于300px*300px jpg/png/gif" name="avatar">
          <Upload maxCount={1} />
        </Form.Item>
        <Form.Item label="商家名称" name="name">
          <Input placeholder="请输入商家名称" />
        </Form.Item>
        <Form.Item label="商家行业" name="categoryId">
          <Input placeholder="请输入商家名称" />
        </Form.Item>
        <Form.Item label="商家地址" name="address">
          <Input placeholder="请输入商家地址" />
        </Form.Item>
      </SectionGroup>
    </>
  );
};
export default EditBase;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionGroup: {
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    paddingTop: 13,
  },
});
