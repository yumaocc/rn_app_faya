import {useRequest} from 'ahooks';
import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {BoolEnum} from '../../../models/common';
import {SectionGroup, FormTitle, Form, Input, Select, PlusButton, Cascader} from '../../../component';
import * as api from '../../../apis';
import {MerchantCreateType, MerchantType} from '../../../models';
import Upload from '../../../component/Form/Upload';
import {useLoadCity} from '../../../helper/hooks';

interface EditBaseProps {
  type: MerchantCreateType;
}

const EditBase: React.FC<EditBaseProps> = ({type}) => {
  const {cityList} = useLoadCity();
  const [city, setCity] = useState<(string | number)[]>();
  console.log(cityList, city, setCity);
  const {data} = useRequest(async () => {
    const res = await api.merchant.getMerchantCategories();

    const category = res.map(item => ({
      value: item.id,
      label: item.name,
    }));
    return Promise.resolve(category);
  });

  return (
    <>
      <SectionGroup style={styles.sectionGroup}>
        <FormTitle title="基本信息" />
        <Form.Item label="商家LOGO" horizontal desc="大于300px*300px jpg/png/gif" name="avatar">
          <Upload maxCount={1} />
        </Form.Item>
        <Form.Item label="商家名称" name="name">
          <Input placeholder="请输入商家名称" />
        </Form.Item>
        <Form.Item label="商家行业" name="categoryId">
          <Select options={data || []} />
        </Form.Item>
        <Form.Item label="商家模式" name="multiStore">
          <Select
            options={[
              {value: BoolEnum.FALSE, label: '单店'},
              {value: BoolEnum.TRUE, label: '多店'},
            ]}
          />
        </Form.Item>
        <Form.Item label="商家类型" name="businessType">
          <Select
            options={[
              {value: MerchantType.ENTERPRISE, label: '企业'},
              {value: MerchantType.INDIVIDUAL, label: '个体工商户'},
            ]}
          />
        </Form.Item>
        <Form.Item name="areaInfo" label="商家城市">
          <Cascader options={cityList || []} placeholder="请输入" />
        </Form.Item>
        <Form.Item label="站点" name="locationWithCompanyId">
          <Cascader options={cityList || []} placeholder="请输入" />
        </Form.Item>
        <Form.Item label="商家地址" name="address">
          <Input placeholder="请输入商家地址" />
        </Form.Item>
        {MerchantCreateType.PRIVATE_SEA === type && (
          <FormTitle
            title="店铺信息"
            style={{height: 40, alignItems: 'center'}}
            headerRight={
              <PlusButton
                title="新增店铺"
                onPress={() => {
                  console.log(1);
                }}
              />
            }
          />
        )}
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
