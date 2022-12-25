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

const SelectShop: React.FC<SelectShopProps> = ({shopList, open, setOpen, setValue}) => {
  const [currentShopList, setCurrentShopList] = useState<ShopForm[]>([]);
  const [checkAll, setCheckAll] = useState(false);
  const [len, setLen] = useState(0);
  useEffect(() => {
    if (open) {
      const list: ShopForm[] = [];
      shopList.forEach(item => {
        list.push({...item, checked: false});
      });
      setCurrentShopList(list);
    }
  }, [open, shopList]);

  useEffect(() => {
    if (checkAll) {
    } else {
      setCurrentShopList(list =>
        list.map(item => {
          item.checked = false;
          return item;
        }),
      );
    }
  }, [checkAll, shopList]);

  const onChange = (id: number, checked: boolean) => {
    if (checked) {
      setLen(len + 1);
    } else {
      setLen(len - 1);
    }
    setCurrentShopList(list =>
      list.map(item => {
        if (item.id === id) {
          item.checked = checked;
        }
        return item;
      }),
    );
  };

  const handleCheckAll = (e: boolean) => {
    if (e) {
      setLen(currentShopList?.length);
    } else {
      setLen(0);
    }
    setCheckAll(e);
    setCurrentShopList(list =>
      list.map(item => {
        item.checked = e;
        return item;
      }),
    );
  };

  const canUseShopOk = () => {
    const list = currentShopList.filter(item => (item.checked ? true : false));
    setValue('canUseShopIds', list);
    setOpen(false);
  };

  return (
    <Modal visible={open} onClose={() => setOpen(false)} onOk={canUseShopOk}>
      <View style={styles.container}>
        <View style={[globalStyles.borderBottom, {paddingBottom: 10}]}>
          <Text>
            共{currentShopList?.length || 0}家，已选{len}家
          </Text>
        </View>
        <View>
          <Checkbox checked={checkAll} onChange={e => handleCheckAll(e)}>
            全选
          </Checkbox>
        </View>
        <View>
          {currentShopList?.map(item => (
            <Checkbox key={item.id} checked={item?.checked} onChange={e => onChange(item?.id, e)}>
              {item?.shopName}
            </Checkbox>
          ))}
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
