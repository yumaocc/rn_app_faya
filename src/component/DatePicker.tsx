import moment, {Moment} from 'moment';
import React, {useMemo, useState} from 'react';
import {useCallback} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {globalStyles, globalStyleVariables} from '../constants/styles';
import Popup from './Popup';
import Picker from './Picker';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {
  DATE_TIME_FORMAT,
  DEFAULT_END_DATE,
  DEFAULT_START_DATE,
} from '../constants';
// import {useLog} from '../helper/hooks';

type RenderDateFunction = (date: Moment) => React.ReactElement;

interface DatePickerProps {
  value?: Moment;
  mode?: 'datetime' | 'date';
  title?: string;
  min?: Moment;
  max?: Moment;
  children?: React.ReactNode | RenderDateFunction;
  onChange?: (date: Moment) => void;
}

const DatePicker: React.FC<DatePickerProps> = props => {
  const {value, min, max, mode, onChange} = props;

  const [show, setShow] = useState(false);
  const [chosenYear, setChosenYear] = useState<string>(
    moment(value).format('YYYY'),
  );
  const [chosenMonth, setChosenMonth] = useState<string>(
    moment(value).format('MM'),
  );
  const [chosenDay, setChosenDay] = useState<string>(
    moment(value).format('DD'),
  );
  const [chosenHour, setChosenHour] = useState<string>(
    moment(value).format('HH'),
  );
  const [chosenMinute, setChosenMinute] = useState<string>(
    moment(value).format('mm'),
  );

  // 计算可用的年份
  const years = useMemo(() => {
    const years = [];
    const minYear = min.year();
    const maxYear = max.year();
    for (let i = minYear; i <= maxYear; i++) {
      years.push(i.toString());
    }
    return years;
  }, [min, max]);

  // 计算可用的月份
  const months = useMemo(() => {
    const months = [];
    const mmt = moment(`${chosenYear}-01-01`, 'YYYY-MM-DD');
    for (let i = 0; i < 12; i++) {
      const start = mmt.startOf('month').isBetween(min, max, 'month', '[]');
      const end = mmt.endOf('month').isBetween(min, max, 'month', '[]');
      if (mmt.isValid() && (start || end)) {
        months.push(mmt.format('MM'));
      }
      mmt.add(1, 'month');
    }
    return months;
  }, [chosenYear, min, max]);

  // 计算可用的天数
  const days = useMemo(() => {
    const days = [];
    const mmt = moment(`${chosenYear}-${chosenMonth}-01`, 'YYYY-MM-DD');
    const maxDay = mmt.daysInMonth();
    for (let i = 0; i < maxDay; i++) {
      const start = mmt.startOf('day').isBetween(min, max, 'day', '[]');
      const end = mmt.endOf('day').isBetween(min, max, 'day', '[]');
      if (mmt.isValid() && (start || end)) {
        days.push(mmt.format('DD'));
      }
      mmt.add(1, 'day');
    }
    return days;
  }, [min, max, chosenYear, chosenMonth]);

  // 计算可用的小时
  const hours = useMemo(() => {
    const hours = [];
    for (let i = 0; i < 24; i++) {
      hours.push(i.toString().padStart(2, '0'));
    }
    return hours;
  }, []);

  // 计算可用的分钟
  const minutes = useMemo(() => {
    const minutes = [];
    for (let i = 0; i < 60; i++) {
      minutes.push(i.toString().padStart(2, '0'));
    }
    return minutes;
  }, []);

  // 当前选中的时间
  const currentDate = useMemo(() => {
    const date = moment(
      `${chosenYear}-${chosenMonth}-${chosenDay} ${chosenHour}:${chosenMinute}`,
      'YYYY-MM-DD HH:mm',
    );
    if (date.isValid()) {
      if (date.isAfter(max)) {
        return max;
      }
      if (date.isBefore(min)) {
        return min;
      }
      return date;
    }
    return min;
  }, [chosenYear, chosenMonth, chosenDay, chosenHour, chosenMinute, min, max]);
  // useLog(chosenYear, 'chosenYear');
  // useLog(months, 'months');
  // useLog(days, 'days');
  // useLog(currentDate, 'currentDate');
  // useLog(value, 'value');
  // useLog(hours, 'hours');
  // useLog(minutes, 'minutes');

  const handleClose = useCallback(() => {
    setShow(false);
  }, []);

  function handleOk() {
    onChange && onChange(currentDate);
    handleClose();
  }

  const renderChild = useCallback(() => {
    if (!props.children) {
      return <Text>{value.format('YYYY-MM-DD HH:mm')}</Text>;
    }
    if (typeof props.children === 'function') {
      return props.children(value);
    }
    return props.children;
  }, [value, props]);

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          setShow(true);
        }}>
        {renderChild()}
      </TouchableOpacity>
      <Popup visible={show} onClose={handleClose}>
        <View style={styles.container}>
          <View style={[globalStyles.borderBottom, styles.headerWrapper]}>
            <TouchableOpacity onPress={handleClose}>
              <Text>取消</Text>
            </TouchableOpacity>
            <Text style={styles.title}>{props.title}</Text>
            <TouchableOpacity onPress={handleOk}>
              <Text style={styles.ok}>确定</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.pickerContainer}>
            <Picker
              style={{flex: 1}}
              value={chosenYear}
              onChange={setChosenYear}
              items={years.map(item => ({label: item, value: item}))}
            />
            <Picker
              style={{flex: 1}}
              value={chosenMonth}
              onChange={setChosenMonth}
              items={months.map(item => ({label: item, value: item}))}
            />
            <Picker
              style={{flex: 1}}
              value={chosenDay}
              onChange={setChosenDay}
              items={days.map(item => ({label: item, value: item}))}
            />
            {mode === 'datetime' && (
              <>
                <Picker
                  style={{flex: 1}}
                  value={chosenHour}
                  onChange={setChosenHour}
                  items={hours.map(item => ({label: item, value: item}))}
                />
                <Picker
                  style={{flex: 1}}
                  value={chosenMinute}
                  onChange={setChosenMinute}
                  items={minutes.map(item => ({label: item, value: item}))}
                />
              </>
            )}
          </View>
        </View>
      </Popup>
    </>
  );
};
DatePicker.defaultProps = {
  title: '选择日期',
  mode: 'date',
  value: moment(),
  min: moment(DEFAULT_START_DATE, DATE_TIME_FORMAT).startOf('day'),
  max: moment(DEFAULT_END_DATE, DATE_TIME_FORMAT).endOf('day'),
};
export default DatePicker;
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  headerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  pickerContainer: {
    flexDirection: 'row',
  },
  ok: {
    color: globalStyleVariables.COLOR_PRIMARY,
  },
});
