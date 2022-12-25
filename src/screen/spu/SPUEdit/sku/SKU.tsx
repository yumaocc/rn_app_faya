import {Button} from '@ant-design/react-native';
import React from 'react';
import {Control, UseFormGetValues, UseFormSetValue, UseFormWatch} from 'react-hook-form';
import {ScrollView, Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import {Footer, Form, FormTitle, Input, SectionGroup, Switch} from '../../../../component';
import {BoolEnum, SPUForm} from '../../../../models';
import {RootState} from '../../../../redux/reducers';
import {styles} from '../style';

import SKUList from './SKUList';

interface SKUProps {
  onNext?: () => void;
  control?: Control<SPUForm, any>;
  setValue?: UseFormSetValue<SPUForm>;
  getValues?: UseFormGetValues<SPUForm>;
  watch?: UseFormWatch<SPUForm>;
}

const SKU: React.FC<SKUProps> = ({onNext}) => {
  const contractDetail = useSelector((state: RootState) => state.contract.currentContract);
  const form = Form.useFormInstance();

  function onCheck() {
    console.log(form.getFieldsValue());
    onNext && onNext();
  }

  return (
    <ScrollView style={{flex: 1}}>
      <SectionGroup style={[{marginTop: 0}, styles.sectionGroupStyle]}>
        <FormTitle title="套餐设置" />
        <Form.Item name="spuStock" label="商品总库存" desc={`总库存${contractDetail?.skuInfoReq?.spuStock}份`}>
          <Input type="number" placeholder="请输入商品库存" />
        </Form.Item>
        <Form.Item label="设置多套餐">
          <Switch checked={contractDetail?.skuInfoReq?.skuInfo.length > 1} disabled />
        </Form.Item>
        <Form.Item label="套餐共享库存">
          <Switch checked={contractDetail?.skuInfoReq?.openSkuStock === BoolEnum.TRUE} disabled />
        </Form.Item>
      </SectionGroup>

      {/* sku信息 */}
      <SKUList />

      <Footer />
      <View style={styles.button}>
        <Button type="primary" onPress={onCheck}>
          下一步
        </Button>
      </View>
    </ScrollView>
  );
};
// SKU.defaultProps = {
//   title: 'SKU',
// };
export default SKU;
