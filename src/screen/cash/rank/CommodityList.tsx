import moment from 'moment';
import {Moment} from 'moment';
import React, {FC, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {formatMoment} from '../../../helper';
import {useSummaryDispatcher} from '../../../helper/hooks';
import ModalDropdown from 'react-native-modal-dropdown';
import {Picker} from '../../../models';
import {RootState} from '../../../redux/reducers';
import {StyleSheet, Text, View} from 'react-native';
import {date} from '../../../constants';
import {Icon} from '@ant-design/react-native';
import CutOffRule from '../../../component/CutOffRule';
import LinkButton from '../../../component/LinkButton';
import {globalStyles} from '../../../constants/styles';
interface CommodityListProps {
  unit: string;
  title?: string;
}
const CommodityList: FC<CommodityListProps> = ({unit, title}) => {
  const [valueType, setValueType] = useState<Picker>({label: '日', value: 'day'});
  const commissionTop = useSelector((state: RootState) => state.summary.commissionTop);

  const [summaryDispatcher] = useSummaryDispatcher();

  useEffect(() => {
    const start: Moment = moment().startOf(valueType.value);
    const end: Moment = moment().endOf(valueType.value);
    summaryDispatcher.loadCommissionTop([formatMoment(start), formatMoment(end)]);
  }, [summaryDispatcher, valueType]);

  function handleChangeFilter(e: Picker) {
    setValueType(e);
  }
  return (
    <>
      <View style={styles.content}>
        <View style={styles.dropDownMenu}>
          <Text>{title}</Text>
          <View style={styles.dropDown}>
            <ModalDropdown
              dropdownStyle={globalStyles.dropDownItem}
              renderRow={item => (
                <View style={[globalStyles.dropDownText]}>
                  <Text>{item.label}</Text>
                </View>
              )}
              options={date}
              defaultValue={valueType.label}
              onSelect={(_, text) => handleChangeFilter(text as Picker)}>
              <View style={{flexDirection: 'row'}}>
                <Text>{valueType.label}</Text>
                <Icon name="caret-down" color="#030303" style={[{marginLeft: 7}, globalStyles.fontPrimary]} />
              </View>
            </ModalDropdown>
          </View>
        </View>
        {commissionTop?.map((item, index) => {
          if (index > 4) {
            return null;
          }
          return (
            <View key={item.spuId}>
              <View style={styles.rankList}>
                <Text style={styles.index}>{index + 1}</Text>
                <Text>{item.name}</Text>
                <Text style={{color: '#4AB87D'}}>
                  +{item.allCommissionYuan}&nbsp;
                  {unit}
                </Text>
              </View>
              <CutOffRule />
              {index === 4 && (
                <View style={styles.more}>
                  <LinkButton title={'查看更多'} onPress={() => console.log('查看更多')} />
                </View>
              )}
            </View>
          );
        })}
      </View>
    </>
  );
};

export default CommodityList;

export const styles = StyleSheet.create({
  content: {
    width: '100%',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginTop: 10,
  },
  contentOneBtn: {
    width: '100%',
    height: 100,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  iconBg: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  dropDown: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropDownMenu: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  index: {
    fontWeight: '900',
    fontSize: 15,
    color: '#999999',
  },
  rankList: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rankListMoney: {
    color: '#4AB87D',
    fontSize: 12,
  },
  more: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
