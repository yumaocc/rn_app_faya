import {Button} from '@ant-design/react-native';
import React from 'react';
import {Control, UseFormGetValues, UseFormSetValue, UseFormWatch} from 'react-hook-form';
import {ScrollView, View} from 'react-native';
import {useSelector} from 'react-redux';
import {Footer, Form, FormTitle, Input, SectionGroup, Switch} from '../../../../component';
import {BoolEnum} from '../../../../models';
import {Controller} from 'react-hook-form';
import {RootState} from '../../../../redux/reducers';
import {styles} from '../style';

import SKUList from './SKUList/SKUList';

interface SKUProps {
  onNext?: () => void;
  control?: Control<any, any>;
  setValue?: UseFormSetValue<any>;
  getValues?: UseFormGetValues<any>;
  watch?: UseFormWatch<any>;
}

const SKU: React.FC<SKUProps> = ({onNext, control, setValue, getValues, watch}) => {
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
        <Controller
          name="stockAmount"
          control={control}
          render={({field: {value, onChange}}) => (
            <Form.Item label="商品总库存" desc={`总库存${contractDetail?.skuInfoReq?.spuStock}份`}>
              <Input type="number" placeholder="请输入商品库存" value={value} onChange={onChange} />
            </Form.Item>
          )}
        />

        <Form.Item label="设置多套餐">
          <Switch checked={contractDetail?.skuInfoReq?.skuInfo.length > 1} disabled />
        </Form.Item>

        <Form.Item label="套餐共享库存">
          <Switch checked={contractDetail?.skuInfoReq?.openSkuStock === BoolEnum.TRUE} disabled />
        </Form.Item>
      </SectionGroup>

      {/* sku信息 */}
      <SKUList control={control} setValue={setValue} getValues={getValues} watch={watch} />

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
