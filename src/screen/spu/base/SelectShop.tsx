import {Checkbox} from '@ant-design/react-native';
import {OnChangeParams} from '@ant-design/react-native/lib/checkbox/PropsType';
import React, {MutableRefObject, useEffect, useImperativeHandle, useMemo, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {globalStyles} from '../../../constants/styles';
import {useLog} from '../../../helper/hooks';
import {RootState} from '../../../redux/reducers';

export interface ImperativeRef {
  getValue: () => number[];
}

interface SelectShopProps {
  value: number[];
  shopRef?: MutableRefObject<ImperativeRef>;
}
const CheckboxItem = Checkbox.CheckboxItem;

const SelectShop: React.FC<SelectShopProps> = props => {
  const {value} = props;

  const [currentIds, setCurrentIds] = useState<Set<number>>(new Set(value));
  const currentMerchant = useSelector((state: RootState) => state.merchant.currentMerchant);
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false);
  const shopList = useMemo(() => currentMerchant?.shopList || [], [currentMerchant]);

  useImperativeHandle(props.shopRef, () => ({
    getValue: () => [...currentIds],
  }));

  useEffect(() => {
    if (value?.length) {
      setCurrentIds(new Set(value));
    }
  }, [value]);

  useEffect(() => {
    setCheckAll(currentIds.size && currentIds.size === shopList.length);
    setIndeterminate(currentIds.size && currentIds.size < shopList.length);
  }, [currentIds, shopList]);

  function handleChangeCheckAll(e: OnChangeParams) {
    const checked = e.target.checked;
    if (checked) {
      setCurrentIds(new Set(shopList.map(e => e.id)));
    } else {
      setCurrentIds(new Set());
    }
  }
  function onChange(value: any, e: OnChangeParams) {
    if (e.target.checked) {
      currentIds.add(value);
    } else {
      currentIds.delete(value);
    }
    setCurrentIds(new Set(currentIds));
  }
  useLog(currentIds);

  return (
    <View style={styles.container}>
      <View style={[globalStyles.borderBottom, {paddingBottom: 10}]}>
        <Text>
          共{shopList.length || 0}家，已选{currentIds?.size}家
        </Text>
      </View>
      <View>
        <CheckboxItem styles={{Line: styles.item}} indeterminate={indeterminate} checked={checkAll} onChange={handleChangeCheckAll}>
          全选
        </CheckboxItem>
      </View>
      <View>
        {shopList.map(item => (
          <CheckboxItem styles={{Line: styles.item}} key={item.id} checked={currentIds.has(item.id)} onChange={e => onChange(item?.id, e)}>
            {item.shopName}
          </CheckboxItem>
        ))}
      </View>
    </View>
  );
};
SelectShop.defaultProps = {};
export default SelectShop;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    borderBottomWidth: 0,
    height: 30,
    minHeight: 20,
  },
});
