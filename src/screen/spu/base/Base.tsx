import moment from 'moment';
import React from 'react';
import {View} from 'react-native';
import {DatePicker} from '../../../component';

interface BaseProps {
  title?: string;
}

const Base: React.FC<BaseProps> = () => {
  const [date, setDate] = React.useState(moment('2017-05-17 11:11:11'));
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <DatePicker value={date} onChange={setDate} mode="datetime" />
    </View>
  );
};
Base.defaultProps = {
  title: 'Base',
};
export default Base;
