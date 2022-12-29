import React from 'react';
import {FC} from 'react';
import {Text, View} from 'react-native';
import {globalStyles} from '../../../constants/styles';
import {useForm, Controller, UseFieldArrayAppend} from 'react-hook-form';
import Modal from '../../../component/Modal';
import {FormMerchant} from '../../../models';
import _ from 'lodash';
import {ErrorMessage} from '@hookform/error-message';
import {InputItem} from '@ant-design/react-native';

interface EditShopProps {
  nextIndex?: number;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setValue: UseFieldArrayAppend<FormMerchant, any>;
}

const EditShop: FC<EditShopProps> = ({open, setOpen, setValue}) => {
  const {
    control,
    formState: {errors},
    handleSubmit,
  } = useForm({
    mode: 'onBlur',
  });
  const getError = (value: any) => {
    const errorArr: string[] = [];
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        const element = value[key];
        const e = _.pick<string>(element, 'message');
        errorArr.push(e);
      }
    }
    const firstError = errorArr.pop();
    console.log(firstError);
  };

  const onOk = async (value: any) => {
    try {
      const errorLength = Object.keys(errors);
      setValue(value);

      if (!errorLength.length) {
        setOpen(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Modal visible={open} onOk={handleSubmit(onOk, getError)} onClose={() => setOpen(false)}>
      <Controller
        name={'shopName'}
        control={control}
        rules={{required: '请输入商家名称'}}
        render={({field}) => (
          <View style={globalStyles.moduleMarginTop}>
            <Text style={[globalStyles.fontPrimary]}>商家名称</Text>
            <View style={[{padding: 0, margin: 0, backgroundColor: '#f4f4f4'}, globalStyles.moduleMarginTop]}>
              <InputItem style={{padding: 0, margin: 0}} placeholder="请输入商家名称" onChange={field.onChange} value={field.value} />
              <Text style={globalStyles.error}>
                <ErrorMessage name={'shopName'} errors={errors} />
              </Text>
            </View>
          </View>
        )}
      />
      <Controller
        name={'contactPhone'}
        control={control}
        rules={{required: '请输入商家电话'}}
        render={({field}) => (
          <View style={globalStyles.moduleMarginTop}>
            <Text style={[globalStyles.fontPrimary]}>商家电话</Text>
            <View style={[{padding: 0, margin: 0, backgroundColor: '#f4f4f4'}, globalStyles.moduleMarginTop]}>
              <InputItem style={{padding: 0, margin: 0}} placeholder="请输入商家电话" onChange={field.onChange} value={field.value} onBlur={field.onBlur} />
            </View>
            {errors.contactPhone && <Text style={globalStyles.error}>请输入商家电话</Text>}
          </View>
        )}
      />
      <Controller
        name={'latitude'}
        control={control}
        render={({field}) => (
          <View style={globalStyles.moduleMarginTop}>
            <Text style={[globalStyles.fontPrimary]}>纬度</Text>
            <View style={[{padding: 0, margin: 0, backgroundColor: '#f4f4f4'}, globalStyles.moduleMarginTop]}>
              <InputItem style={{padding: 0, margin: 0}} placeholder="请输入纬度" onChange={field.onChange} value={field.value} onBlur={field.onBlur} />
            </View>
          </View>
        )}
      />
      <Controller
        name={'longitude'}
        control={control}
        render={({field}) => (
          <View style={globalStyles.moduleMarginTop}>
            <Text style={[globalStyles.fontPrimary]}>经度</Text>
            <View style={[{padding: 0, margin: 0, backgroundColor: '#f4f4f4'}, globalStyles.moduleMarginTop]}>
              <InputItem style={{padding: 0, margin: 0}} placeholder="请输入经度" onChange={field.onChange} value={field.value} onBlur={field.onBlur} />
            </View>
          </View>
        )}
      />
      <Controller
        name={'addressDetail'}
        control={control}
        render={({field}) => (
          <View style={globalStyles.moduleMarginTop}>
            <Text style={[globalStyles.fontPrimary]}>店铺地址</Text>
            <View style={[{padding: 0, margin: 0, backgroundColor: '#f4f4f4'}, globalStyles.moduleMarginTop]}>
              <InputItem style={{padding: 0, margin: 0}} placeholder="请输入店铺地址" onChange={field.onChange} value={field.value} onBlur={field.onBlur} />
            </View>
          </View>
        )}
      />
    </Modal>
  );
};

export default EditShop;
