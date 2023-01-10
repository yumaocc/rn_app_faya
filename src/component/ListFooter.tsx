import React from 'react';
import {FC} from 'react';
import {View, Text} from 'react-native';
import {globalStyles, globalStyleVariables} from '../constants/styles';
import {LoadingState} from '../models/common';

interface ListFooterProps {
  status?: LoadingState;
  marginVertical?: number;
}
const ListFooter: FC<ListFooterProps> = props => {
  const {status, marginVertical} = props;
  console.log(status);
  switch (status) {
    case 'loading':
      return (
        <View style={[globalStyles.containerCenter, {marginVertical: marginVertical}]}>
          <Text style={globalStyles.fontTertiary}>加载中...</Text>
        </View>
      );
    case 'noMore':
      return (
        <View style={[globalStyles.containerCenter, {marginVertical: marginVertical}]}>
          <Text style={globalStyles.fontTertiary}>已经到底了哦</Text>
        </View>
      );
    default:
      return <></>;
  }
};
export default ListFooter;
ListFooter.defaultProps = {
  marginVertical: globalStyleVariables.MODULE_SPACE,
};
