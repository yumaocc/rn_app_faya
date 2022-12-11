import {Button} from '@ant-design/react-native';
import React, {FC, useEffect} from 'react';
import {Control, UseFormGetValues, UseFormSetValue, UseFormWatch} from 'react-hook-form';
import {StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {Form, FormTitle, Input, SectionGroup, Select, SelfText} from '../../../../component';
import {useMerchantDispatcher} from '../../../../helper/hooks';
import {Contract, FormControlC, ProtocolType, SettlementType} from '../../../../models';
import {RootState} from '../../../../redux/reducers';
interface BaseProps {
  onNext: () => void;
  Controller: FormControlC;
  control: Control<Contract, any>;
  setValue: UseFormSetValue<Contract>;
  getValues: UseFormGetValues<Contract>;
  watch: UseFormWatch<Contract>;
}
const Base: FC<BaseProps> = ({Controller, control, watch, setValue, onNext, getValues}) => {
  const [merchantDispatcher] = useMerchantDispatcher();
  const bizUserId = watch('bizUserId');
  //商家列表
  const merchantList = useSelector((state: RootState) => {
    const list = state.merchant.merchantSearchList.map(item => {
      return {
        label: item.name,
        value: item.id,
        partyAName: item.partyAName,
      };
    });
    return list;
  });
  //根据合同设置乙方的值
  useEffect(() => {
    if (bizUserId) {
      const [partyAName] = merchantList.filter(item => item.value === bizUserId);
      setValue('partyBName', partyAName?.partyAName);
    }
  }, [bizUserId, merchantList, setValue]);

  useEffect(() => {
    merchantDispatcher.loadMerchantSearchList({name: ''});
  }, [merchantDispatcher]);

  const next = () => {
    getValues();
    onNext();
  };
  return (
    <>
      <SectionGroup style={styles.sectionGroup}>
        <FormTitle title="商家信息" />
        <Controller
          name="bizUserId"
          control={control}
          render={({field: {value, onChange}}) => (
            <Form.Item label="商家">
              <Select value={value} onChange={onChange} options={merchantList || []} />
            </Form.Item>
          )}
        />
        <Controller
          name="partyAName"
          control={control}
          render={({field: {value}}) => (
            <Form.Item label="甲方">
              <SelfText value={value} />
            </Form.Item>
          )}
        />
        <Controller
          name="partyBName"
          control={control}
          render={({field: {value}}) => (
            <Form.Item label="乙方">
              <SelfText value={value} />
            </Form.Item>
          )}
        />
      </SectionGroup>
      <SectionGroup style={styles.sectionGroup}>
        <FormTitle title="合同基本信息" />
        <Controller
          name="contractName"
          control={control}
          render={({field: {value, onChange}}) => (
            <Form.Item label="合同名称">
              <Input value={value} onChange={onChange} />
            </Form.Item>
          )}
        />
        <Controller
          name="protocolType"
          control={control}
          defaultValue={ProtocolType.TWO_PARTY}
          render={({field: {value}}) => (
            <Form.Item label="协议类型">
              <Select options={[{label: '两方协议', value: ProtocolType.TWO_PARTY}]} value={value} />
            </Form.Item>
          )}
        />
      </SectionGroup>
      <SectionGroup style={styles.sectionGroup}>
        <FormTitle title="结算方式" />
        <Controller
          name="settlementType"
          control={control}
          defaultValue={SettlementType.T1}
          render={({field: {value}}) => (
            <Form.Item label="结算方式">
              <Select options={[{label: 'T+1', value: SettlementType.T1}]} value={value} />
            </Form.Item>
          )}
        />
      </SectionGroup>
      <Button style={{margin: 10}} type="primary" onPress={next}>
        下一步
      </Button>
    </>
  );
};
export default Base;

export const styles = StyleSheet.create({
  sectionGroup: {
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    paddingTop: 13,
  },
});
