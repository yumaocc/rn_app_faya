import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {noop} from '../constants';
import {globalStyleVariables} from '../constants/styles';
import {StylePropView} from '../models';

interface TabItem {
  title: string;
  key: string;
}

interface TabsProps {
  onChange?: (key: string) => void;
  defaultActiveKey?: string;
  currentKey?: string;
  tabs: TabItem[];
  style?: StylePropView;
  topBorder?: boolean;
  underline?: boolean;
}

const Tabs: React.FC<TabsProps> = props => {
  const {onChange, defaultActiveKey, tabs, currentKey, topBorder, underline} = props;

  const [activeKey, setActiveKey] = useState(defaultActiveKey || tabs[0]?.key || '');

  useEffect(() => {
    if (currentKey) {
      setActiveKey(currentKey);
    }
  }, [currentKey]);

  const changeTab = (key: string) => {
    if (key !== activeKey) {
      setActiveKey(key);
      onChange && onChange(key);
    }
  };
  return (
    <View style={[styles.container, props.style, topBorder ? styles.topBorder : {}]}>
      {tabs.map(tab => {
        return (
          <TouchableOpacity key={tab.key} activeOpacity={0.7} onPress={() => changeTab(tab.key)}>
            <View style={[underline ? (activeKey === tab.key ? styles.activeBottom : {}) : {}]}>
              <Text style={[styles.tabText, activeKey === tab.key ? styles.activeTabText : {}]}>{tab.title}</Text>
              {/* 指示器 */}

              {/* <View /> */}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
Tabs.defaultProps = {
  onChange: noop,
  defaultActiveKey: '',
  currentKey: '',
};
export default Tabs;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    // backgroundColor: '#6cf',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 40,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    borderBottomWidth: 1,
  },
  topBorder: {
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    borderTopWidth: 3,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
    color: globalStyleVariables.TEXT_COLOR_PRIMARY,
  },
  activeTabText: {
    color: globalStyleVariables.COLOR_PRIMARY,
  },
  activeBottom: {
    borderBottomColor: globalStyleVariables.COLOR_PRIMARY,
    borderBottomWidth: 2,
    padding: globalStyleVariables.MODULE_SPACE,
  },
});
