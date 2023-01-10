import React from 'react';
import {FC} from 'react';
import {Text} from 'react-native';
import {globalStyles} from '../constants/styles';
import {LoadingState} from '../models/common';

interface ListFooterProps {
  status?: LoadingState;
}
const ListFooter: FC<ListFooterProps> = props => {
  const {status} = props;
  const getStatusText = () => {
    switch (status) {
      case 'loading':
        return ' 加载中...';
      case 'noMore':
        return '已经到底了哦';
      default:
        return '1';
    }
  };
  return <Text style={[globalStyles.fontTertiary, {textAlign: 'center'}]}>{getStatusText()}</Text>;
};
export default ListFooter;
