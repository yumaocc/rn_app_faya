import {Button} from '@ant-design/react-native';
import React, {FC, useContext, useEffect} from 'react';
import {Control, FieldErrorsImpl, UseFormGetValues, UseFormSetValue, UseFormWatch} from 'react-hook-form';
import {StyleSheet, Text} from 'react-native';
import {useSelector} from 'react-redux';
import {Form, FormTitle, Input, SectionGroup, Select, SelfText} from '../../../../component';
import {useCommonDispatcher, useMerchantDispatcher} from '../../../../helper/hooks';
import {FormControlC, ProtocolType, SettlementType} from '../../../../models';
import {ErrorMessage} from '@hookform/error-message';
import {RootState} from '../../../../redux/reducers';
import {globalStyles} from '../../../../constants/styles';
import {FormDisabledContext} from '../../../../component/Form/Context';
import Error from '../../../../component/Error';
interface BaseProps {
  onNext?: () => void;
  Controller: FormControlC;
  control: Control<any, any>;
  setValue: UseFormSetValue<any>;
  getValues: UseFormGetValues<any>;
  watch: UseFormWatch<any>;
  errors: Partial<FieldErrorsImpl<any>>;
}
const Base: FC<BaseProps> = ({Controller, control, watch, setValue, onNext, errors}) => {
  const [merchantDispatcher] = useMerchantDispatcher();
  const [commonDispatcher] = useCommonDispatcher();
  const {disabled} = useContext(FormDisabledContext);
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
    if (bizUserId) {
      onNext();
      return;
    }
    commonDispatcher.info('请先选择商家');
  };
  return (
    <>
      <SectionGroup style={styles.sectionGroup}>
        <FormTitle title="商家信息" />
        <Controller
          name="bizUserId"
          control={control}
          rules={{required: '请选择商家'}}
          render={({field: {value, onChange}}) => (
            <Form.Item showAsterisk label="商家">
              <Select value={value} onChange={onChange} options={merchantList || []} />
              <>
                {errors?.bizUserId && (
                  <Text style={globalStyles.error}>
                    <ErrorMessage name={'bizUserId'} errors={errors} />
                  </Text>
                )}
              </>
            </Form.Item>
          )}
        />
        <Controller
          name="partyAName"
          control={control}
          render={({field: {value}}) => (
            <Form.Item showAsterisk label="甲方">
              <SelfText value={value} />
            </Form.Item>
          )}
        />
        <Controller
          name="partyBName"
          control={control}
          render={({field: {value}}) => (
            <Form.Item showAsterisk label="乙方">
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
          rules={{required: '请输入合同名称'}}
          render={({field: {value, onChange}}) => (
            <Form.Item showAsterisk label="合同名称">
              <Input value={value} onChange={onChange} />
              <>
                {errors?.contractName && (
                  <Error top={-9}>
                    <ErrorMessage name={'contractName'} errors={errors} />
                  </Error>
                )}
              </>
            </Form.Item>
          )}
        />
        <Controller
          name="protocolType"
          control={control}
          defaultValue={ProtocolType.TWO_PARTY}
          render={({field: {value}}) => (
            <Form.Item showAsterisk label="协议类型">
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
            <Form.Item showAsterisk label="结算方式">
              <Select options={[{label: 'T+1', value: SettlementType.T1}]} value={value} />
            </Form.Item>
          )}
        />
      </SectionGroup>
      {disabled ? null : (
        <Button style={{margin: 10}} type="primary" onPress={next}>
          下一步
        </Button>
      )}
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
