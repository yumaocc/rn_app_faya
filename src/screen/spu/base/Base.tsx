import moment from 'moment';
import React from 'react';
import {View, Text} from 'react-native';
import {DatePicker} from '../../../component';
import {DATE_TIME_FORMAT} from '../../../constants';

interface BaseProps {
  title?: string;
}

const Base: React.FC<BaseProps> = () => {
  const [date, setDate] = React.useState(moment('2017-05-17 11:11:11'));
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <DatePicker value={date} onChange={setDate} mode="datetime">
        <Text style={{textAlign: 'center'}}>
          当前时间:{date.format(DATE_TIME_FORMAT)}
        </Text>
      </DatePicker>
    </View>
  );
};
Base.defaultProps = {
  title: 'Base',
};
export default Base;
