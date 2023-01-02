// import {Checkbox, Divider} from 'antd';
import {Checkbox, Icon} from '@ant-design/react-native';
import React from 'react';
import {FC, useCallback, useEffect, useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {globalStyles, globalStyleVariables} from '../constants/styles';
// import { useLog } from '@/helper/hooks';

// function arrIncludesAll(arr: Array<number | string>, arrSet: Array<number | string>) {
//   return arrSet.every((item) => arr.includes(item));
// }

function setIncludesAll(arr: Set<number | string>, arrSet: Array<number | string>) {
  return arrSet.every(item => arr.has(item));
}

interface FlatTreeProps {
  treeData: any[];
  selectedKeys: string[] | number[];
  fieldNames: {
    title?: string;
    key?: string;
    children?: string;
  };
  onChange?: (keys: number[]) => void;
}

const FlatTree: FC<FlatTreeProps> = props => {
  const {fieldNames, treeData, selectedKeys} = props;
  const [checkedKeys, setCheckedKeys] = useState(new Set([...selectedKeys])); // 集合
  const titleName = fieldNames.title || 'title';
  const keyName = fieldNames.key || 'key';
  const [checkedIsShow, setCheckedIsShow] = useState<any[]>(() => {
    return treeData.map(item => ({id: item.id, isShow: false}));
  });
  const childrenName = fieldNames.children || 'children';

  const fireChange = useCallback(
    (keys: Set<number | string>) => {
      const arr = Array.from(keys);
      props.onChange && props.onChange(arr);
    },
    [props],
  );

  useEffect(() => {
    const arr = selectedKeys || [];
    setCheckedKeys(new Set([...arr]));
  }, [selectedKeys]);

  const isAllSelected = useCallback(
    (key: string | number) => {
      const data = treeData.find(item => item[keyName] === key);
      if (!data) {
        return false;
      }
      const keys = data[childrenName]?.map(e => e[keyName]) || [];
      return setIncludesAll(checkedKeys, keys);
    },
    [checkedKeys, childrenName, keyName, treeData],
  );

  const isSelected = useCallback(
    (key: string | number) => {
      return checkedKeys.has(key);
    },
    [checkedKeys],
  );
  // useLog(checkedKeys, 'checkedKeys');

  const handleCheckOne = useCallback(
    (e: boolean, key: string | number) => {
      const value = e;
      if (value) {
        checkedKeys.add(key);
        setCheckedKeys(new Set([...checkedKeys]));
      } else {
        checkedKeys.delete(key);
        setCheckedKeys(new Set([...checkedKeys]));
      }
      fireChange(checkedKeys);
    },
    [checkedKeys, fireChange],
  );

  // 选中整个省
  const handleCheckSome = useCallback(
    (e: boolean, key: string | number) => {
      const value = e;
      const data = treeData.find(item => item[keyName] === key);
      if (!data) {
        return;
      }
      const keys = data[childrenName]?.map(e => e[keyName]) || [];
      if (value) {
        keys.forEach(item => {
          checkedKeys.add(item);
        });
      } else {
        keys.forEach(item => {
          checkedKeys.delete(item);
        });
      }
      setCheckedKeys(new Set([...checkedKeys]));
      fireChange(checkedKeys);
    },
    [checkedKeys, childrenName, fireChange, keyName, treeData],
  );

  // 整个省是否部分选中
  const isIndeterminate = useCallback(
    (key: number | string) => {
      const data = treeData.find(item => item[keyName] === key);
      if (!data) {
        return false;
      }
      const keys = data[childrenName]?.map((e: any) => e[keyName]) || [];
      let hasChecked = false;
      let hasUnchecked = false;
      keys.forEach((item: any) => {
        if (checkedKeys.has(item)) {
          hasChecked = true;
        } else {
          hasUnchecked = true;
        }
      });
      return hasChecked && hasUnchecked;
    },
    [checkedKeys, childrenName, keyName, treeData],
  );
  return (
    <View>
      {treeData.map((dataChunk, index) => {
        return (
          <View key={dataChunk[keyName]} style={[styles.wrapper]}>
            <View style={[globalStyles.containerLR]}>
              <View>
                <Checkbox
                  checked={isAllSelected(dataChunk[keyName])}
                  indeterminate={isIndeterminate(dataChunk[keyName])}
                  onChange={e => handleCheckSome(e.target.checked, dataChunk[keyName])}>
                  {dataChunk[titleName]}
                </Checkbox>
              </View>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() =>
                  setCheckedIsShow(checked =>
                    checked.map((item, idx) => {
                      if (index === idx) {
                        item.isShow = !item.isShow;
                      }
                      return item;
                    }),
                  )
                }>
                <Icon name={checkedIsShow[index].isShow ? 'caret-right' : 'caret-down'} style={styles.arrow} />
              </TouchableOpacity>
            </View>
            <View />
            <View>
              {checkedIsShow[index].isShow && (
                <>
                  <View style={[styles.content, globalStyles.borderBottom]} />
                  {dataChunk[childrenName].map((item: any) => {
                    return (
                      <Checkbox
                        style={{marginBottom: globalStyleVariables.MODULE_SPACE}}
                        checked={isSelected(item[keyName])}
                        key={item[keyName]}
                        onChange={e => handleCheckOne(e.target.checked, item[keyName])}>
                        {item[titleName]}
                      </Checkbox>
                    );
                  })}
                </>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
};

FlatTree.defaultProps = {
  // fieldNames: {
  //   title: 'title',
  //   key: 'key',
  //   children: 'children',
  // },
  selectedKeys: [],
};

export default FlatTree;
const styles = StyleSheet.create({
  wrapper: {
    padding: globalStyleVariables.MODULE_SPACE,
    borderRadius: 5,
    backgroundColor: '#f4f4f4',
    marginBottom: globalStyleVariables.MODULE_SPACE,
  },
  content: {
    marginTop: globalStyleVariables.MODULE_SPACE,
    marginBottom: globalStyleVariables.MODULE_SPACE,
  },
  arrow: {
    transform: [{rotate: '90deg'}],
    marginLeft: 3,
    color: '#000',
    fontSize: 10,
    flex: 1,
  },
});
