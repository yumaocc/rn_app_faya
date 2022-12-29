// 资质信息
import React from 'react';
import {StyleSheet} from 'react-native';
import {SectionGroup, FormTitle, Form, Input, Select} from '../../../component';
import {MerchantCreateType, FormControlC, MerchantAgentType, FormWatch, FormErrors, FormMerchant} from '../../../models';
import Upload from '../../../component/Form/Upload';
import {Control} from 'react-hook-form';

interface CertificationProps {
  type: MerchantCreateType;
  control: Control<FormMerchant, any>;
  Controller: FormControlC;
  watch: FormWatch;
  errors: FormErrors;
}

const Certification: React.FC<CertificationProps> = ({Controller, control, watch}) => {
  const [legalAuthType] = watch(['legalAuthType']);

  return (
    <>
      <SectionGroup style={styles.sectionGroup}>
        <FormTitle title="基本信息" />
        <Controller
          name="businessName"
          control={control}
          render={({field}) => (
            <Form.Item label="商家主体名称">
              <Input placeholder="请输入" value={field.value} onChange={field.onChange} />
            </Form.Item>
          )}
        />
        <Controller
          name="enterpriseUsci"
          control={control}
          render={({field}) => (
            <Form.Item label="统一社会信用代码">
              <Input placeholder="请输入" value={field.value} onChange={field.onChange} />
            </Form.Item>
          )}
        />

        <Controller
          name="legalAuthType"
          control={control}
          defaultValue={MerchantAgentType.LEGAL}
          render={({field}) => (
            <Form.Item label="认证方式">
              <Select
                value={field.value}
                options={[
                  {label: '法人', value: MerchantAgentType.LEGAL},
                  {label: ' 经办人', value: MerchantAgentType.AGENT},
                ]}
                onChange={field.onChange}
              />
            </Form.Item>
          )}
        />
        <Controller
          name="legalPhone"
          control={control}
          render={({field}) => (
            <Form.Item label={`${legalAuthType === MerchantAgentType.LEGAL ? '法人' : '经办人'}手机号`}>
              <Input value={field.value} onChange={field.onChange} />
            </Form.Item>
          )}
        />
        <Controller
          name="legalName"
          control={control}
          render={({field}) => (
            <Form.Item label={`${legalAuthType === MerchantAgentType.LEGAL ? '法人' : '经办人'}姓名`}>
              <Input value={field.value} onChange={field.onChange} />
            </Form.Item>
          )}
        />

        <Controller
          name="legalNumber"
          control={control}
          render={({field}) => (
            <Form.Item label={`${legalAuthType === MerchantAgentType.LEGAL ? '法人' : '经办人'}身份证`}>
              <Input value={field.value} onChange={field.onChange} />
            </Form.Item>
          )}
        />
        <Controller
          name="businessLicense"
          control={control}
          render={({field}) => (
            <Form.Item label="营业执照" horizontal>
              <Upload maxCount={1} value={field.value} onChange={field.onChange} />
            </Form.Item>
          )}
        />
      </SectionGroup>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionGroup: {
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    paddingTop: 13,
  },
});

export default Certification;
