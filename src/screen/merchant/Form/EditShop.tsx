import React from 'react';
import {FC} from 'react';
import {Text} from 'react-native';
import {Form, Input} from '../../../component';
import {globalStyles} from '../../../constants/styles';
import {useForm, Controller, UseFieldArrayAppend} from 'react-hook-form';
import Modal from '../../../component/Modal';
import {FormMerchant} from '../../../models';
interface EditShopProps {
  nextIndex?: number;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setValue: UseFieldArrayAppend<FormMerchant, 'shopList'>;
}

const EditShop: FC<EditShopProps> = ({open, setOpen, setValue}) => {
  const {
    control,
    formState: {errors},
    handleSubmit,
  } = useForm({
    mode: 'onBlur',
  });

  const onOk = (value: any) => {
    const errorLength = Object.keys(errors);
    console.log(errorLength);
    if (errorLength.length <= 0) {
      setValue(value);
      setOpen(false);
    }
  };
  return (
    <Modal visible={open} onOk={handleSubmit(onOk)} onClose={() => setOpen(false)}>
      <Controller
        name={'shopName'}
        control={control}
        rules={{required: true}}
        render={({field}) => (
          <Form.Item label="商家名称">
            <Input placeholder="请输入商家名称" onChange={field.onChange} value={field.value} onBlur={field.onBlur} />
            {errors.shopName && <Text style={globalStyles.error}>请输入商家名称</Text>}
          </Form.Item>
        )}
      />
      <Controller
        name={'contactPhone'}
        control={control}
        rules={{required: true}}
        render={({field}) => (
          <Form.Item label="商家电话">
            <Input placeholder="请输入商家电话" onChange={field.onChange} value={field.value} onBlur={field.onBlur} />
            {errors.contactPhone && <Text style={globalStyles.error}>请输入商家电话</Text>}
          </Form.Item>
        )}
      />
      <Controller
        name={'latitude'}
        control={control}
        render={({field}) => (
          <Form.Item label="纬度">
            <Input placeholder="请输入纬度" onChange={field.onChange} value={field.value} onBlur={field.onBlur} />
          </Form.Item>
        )}
      />
      <Controller
        name={'longitude'}
        control={control}
        render={({field}) => (
          <Form.Item label="经度">
            <Input placeholder="请输入经度" onChange={field.onChange} value={field.value} onBlur={field.onBlur} />
          </Form.Item>
        )}
      />
      <Controller
        name={'addressDetail'}
        control={control}
        rules={{required: true}}
        render={({field}) => (
          <Form.Item label="店铺地址">
            <Input placeholder="请输入店铺地址" onChange={field.onChange} value={field.value} onBlur={field.onBlur} />
            {errors.addressDetail && <Text style={globalStyles.error}>请输入商家地址</Text>}
          </Form.Item>
        )}
      />
    </Modal>
  );
};

export default EditShop;
