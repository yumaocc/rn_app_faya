import React from 'react';
import {FC} from 'react';
import {Text, View} from 'react-native';
import {globalStyles} from '../../../constants/styles';
import {Controller, UseFieldArrayAppend, FieldValues, UseFormReturn, UseFormGetValues} from 'react-hook-form';
import Modal from '../../../component/Modal';
import {FormMerchant, FormSetValue} from '../../../models';
import {useCommonDispatcher} from '../../../helper/hooks';
import {Input} from '../../../component';

interface EditShopProps {
  nextIndex?: number;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  append: UseFieldArrayAppend<FormMerchant, any>;
  shopListForm?: UseFormReturn<FieldValues, any>;
  editShopIndex?: number;
  getValues?: UseFormGetValues<FormMerchant>;
  setValue: FormSetValue;
  setEditShopIndex: React.Dispatch<React.SetStateAction<number>>;
}

const EditShop: FC<EditShopProps> = ({open, setOpen, append, shopListForm, editShopIndex, getValues, setValue, setEditShopIndex}) => {
  const [commonDispatcher] = useCommonDispatcher();
  const {
    control,
    formState: {errors},
    handleSubmit,
  } = shopListForm;

  const onOk = async (value: any) => {
    try {
      if (editShopIndex !== -1) {
        const {shopList} = getValues();
        const newShopList = shopList.map((item, idx) => {
          if (idx === editShopIndex) {
            return value;
          }
          return item;
        });
        setValue('shopList', newShopList);
        setEditShopIndex(-1);
      } else {
        append({
          ...value,
        });
      }
      shopListForm.reset();
      setOpen(false);
    } catch (error) {
      commonDispatcher.error(error || '哎呀，出错了~');
    }
  };

  return (
    <Modal visible={open} onOk={handleSubmit(onOk)} onClose={() => setOpen(false)}>
      <Controller
        name={'shopName'}
        control={control}
        rules={{required: '请输入商家名称'}}
        render={({field}) => (
          <View style={globalStyles.moduleMarginTop}>
            <Text style={[globalStyles.fontPrimary]}>商家名称</Text>
            <View style={[{padding: 0, margin: 0, backgroundColor: '#f4f4f4'}, globalStyles.moduleMarginTop]}>
              <Input textAlign="left" style={{padding: 0, margin: 0}} onChange={field.onChange} value={field.value} onBlur={field.onBlur} />
            </View>
            {errors.shopName && <Text style={globalStyles.error}>请输入商家名称</Text>}
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
              <Input textAlign="left" type="number" style={{padding: 0, margin: 0}} onChange={field.onChange} value={field.value} onBlur={field.onBlur} />
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
              <Input textAlign="left" type="number" style={{padding: 0, margin: 0}} onChange={field.onChange} value={field.value} onBlur={field.onBlur} />
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
              <Input textAlign="left" type="number" style={{padding: 0, margin: 0}} onChange={field.onChange} value={field.value} onBlur={field.onBlur} />
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
              <Input textAlign="left" style={{padding: 0, margin: 0}} onChange={field.onChange} value={field.value} onBlur={field.onBlur} />
            </View>
          </View>
        )}
      />
    </Modal>
  );
};

export default EditShop;
