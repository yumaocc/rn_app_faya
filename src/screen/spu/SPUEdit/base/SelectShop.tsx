// import {Checkbox} from '@ant-design/react-native';
import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {globalStyles} from '../../../../constants/styles';
import {Checkbox, Modal} from '../../../../component';
import {Control, UseFormGetValues, UseFormSetValue, UseFormWatch} from 'react-hook-form';
import {ShopForm} from '../../../../models';

interface SelectShopProps {
  shopList: ShopForm[];
  open?: boolean;
  setOpen?: (value: boolean) => void;
  control?: Control<any, any>;
  setValue?: UseFormSetValue<any>;
  getValues?: UseFormGetValues<any>;
  watch?: UseFormWatch<any>;
}

const SelectShop: React.FC<SelectShopProps> = ({shopList, open, setOpen, setValue, getValues}) => {
  const [currentShopList, setCurrentShopList] = useState<number[]>([]);
  const [checkAll, setCheckAll] = useState(false);
  const [len, setLen] = useState(0);
  useEffect(() => {
    setLen(currentShopList?.length);
  }, [currentShopList]);

  const handleCheckAll = () => {
    if (checkAll) {
      setCheckAll(false);
      setCurrentShopList([]);
    } else {
      setCheckAll(true);
      const newShopList = shopList.map(item => item.id);
      setCurrentShopList(newShopList);
    }
  };
  useEffect(() => {
    if (open) {
      if (currentShopList?.length === shopList?.length) {
        setCheckAll(true);
      }
    }
  }, [currentShopList?.length, open, shopList?.length]);

  useEffect(() => {
    if (open) {
      const {canUseShopIds} = getValues();
      setCurrentShopList(canUseShopIds);
    }
  }, [getValues, open]);

  const canUseShopOk = () => {
    setValue('canUseShopIds', currentShopList);
    setCheckAll(false);
    setOpen(false);
  };

  return (
    <Modal visible={open} onClose={() => setOpen(false)} onOk={canUseShopOk}>
      <View style={styles.container}>
        <View style={[globalStyles.borderBottom, {paddingBottom: 10}]}>
          <Text>
            共{shopList?.length || 0}家，已选{len || 0}家
          </Text>
        </View>
        <View>
          <Checkbox checked={checkAll} onChange={handleCheckAll}>
            全选
          </Checkbox>
        </View>
        <View>
          <Checkbox.Group value={currentShopList} options={shopList.map(item => ({label: item.shopName, value: item.id}))} onChange={setCurrentShopList} />
        </View>
      </View>
    </Modal>
  );
};
SelectShop.defaultProps = {};
export default SelectShop;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
