import {Button} from '@ant-design/react-native';
import React from 'react';
import {Control, FieldErrorsImpl, UseFormGetValues, UseFormHandleSubmit, UseFormSetError, UseFormSetValue, UseFormWatch} from 'react-hook-form';
import {ScrollView, View} from 'react-native';
import {useSelector} from 'react-redux';
import {Footer, Form, FormTitle, Input, SectionGroup, Switch} from '../../../../component';
import {BoolEnum} from '../../../../models';
import {Controller} from 'react-hook-form';
import {RootState} from '../../../../redux/reducers';
import {styles} from '../style';

import SKUList from './SKUList/SKUList';
import {isFloatNumber} from '../../../../helper/util';
import {ErrorMessage} from '@hookform/error-message';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface SKUProps {
  onNext?: () => void;
  control?: Control<any, any>;
  setValue?: UseFormSetValue<any>;
  getValues?: UseFormGetValues<any>;
  watch?: UseFormWatch<any>;
  errors: Partial<FieldErrorsImpl<any>>;
  handleSubmit: UseFormHandleSubmit<any>;
  setError?: UseFormSetError<any>;
}

const SKU: React.FC<SKUProps> = ({onNext, control, setValue, getValues, watch, errors, setError}) => {
  const contractDetail = useSelector((state: RootState) => state.contract.currentContract);
  const {bottom} = useSafeAreaInsets();
  function onCheck() {
    onNext && onNext();
  }

  return (
    <ScrollView style={{flex: 1}} keyboardShouldPersistTaps="always">
      <SectionGroup style={[{marginTop: 0}, styles.sectionGroupStyle]}>
        <FormTitle title="套餐设置" />
        <Controller
          name="stockAmount"
          control={control}
          rules={{
            validate: value => {
              if (isFloatNumber(value)) {
                return '请输入整数';
              }
              return true;
            },
          }}
          render={({field: {value, onChange}}) => (
            <Form.Item label="商品总库存" desc={`总库存${contractDetail?.skuInfoReq?.spuStock}份`} errorElement={<ErrorMessage errors={errors} name="stockAmount" />}>
              <Input type="number" placeholder="请输入商品库存" value={value} onChange={onChange} />
            </Form.Item>
          )}
        />

        <Form.Item label="设置多套餐">
          <Switch checked={contractDetail?.skuInfoReq?.skuInfo.length > 1} disabled />
        </Form.Item>

        <Form.Item label="套餐单独设置库存">
          <Switch checked={contractDetail?.skuInfoReq?.openSkuStock === BoolEnum.TRUE} disabled />
        </Form.Item>
      </SectionGroup>

      {/* sku信息 */}
      <SKUList errors={errors} control={control} setValue={setValue} getValues={getValues} watch={watch} setError={setError} />

      <Footer />
      <View style={[styles.button, {marginBottom: bottom}]}>
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
