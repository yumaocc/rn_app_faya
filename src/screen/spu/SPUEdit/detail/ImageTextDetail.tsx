import {Button} from '@ant-design/react-native';
import React from 'react';
import {View, ScrollView, Text} from 'react-native';
import {Form, FormTitle, SectionGroup, Footer} from '../../../../component';
import {styles} from '../style';
import Upload from '../../../../component/Form/Upload';
import {globalStyles} from '../../../../constants/styles';
import {Controller} from 'react-hook-form';
import {Control, UseFormGetValues, UseFormSetValue, UseFormWatch} from 'react-hook-form';

interface ImageTextDetailProps {
  onNext?: () => void;
  control?: Control<any, any>;
  setValue?: UseFormSetValue<any>;
  getValues?: UseFormGetValues<any>;
  watch?: UseFormWatch<any>;
}

const ImageTextDetail: React.FC<ImageTextDetailProps> = ({onNext, control}) => {
  const form = Form.useFormInstance();

  function onCheck() {
    console.log(form.getFieldsValue());
    onNext && onNext();
  }
  return (
    <ScrollView style={styles.container}>
      <SectionGroup style={[{marginTop: 0}, styles.sectionGroupStyle]}>
        <FormTitle title="图片信息" />
        <Controller
          name="poster"
          control={control}
          render={({field: {value, onChange}}) => (
            <Form.Item label="海报图" vertical desc="1张图，建议尺寸1200*1600，文件大小10M以内，格式jpg/png">
              <Upload maxCount={1} value={value} onChange={onChange} />
            </Form.Item>
          )}
        />
        <Controller
          name="bannerPhotos"
          control={control}
          render={({field: {value, onChange}}) => (
            <Form.Item label="详情Banner" vertical desc="2-18张图，尺寸4:3，建议尺寸1000*750，文件大小3M以内，格式jpg/png">
              <Upload maxCount={18} value={value} onChange={onChange} />
            </Form.Item>
          )}
        />
      </SectionGroup>
      <SectionGroup style={styles.sectionGroupStyle}>
        <FormTitle title="图文信息" />
        <View style={[globalStyles.tagWrapper, {marginVertical: 10}]}>
          <Text style={globalStyles.tag}>为了获得更好的体验，请前往电脑端编辑图文详情</Text>
        </View>
      </SectionGroup>
      <Footer />
      <View style={styles.button}>
        <Button type="primary" onPress={onCheck}>
          下一步
        </Button>
      </View>
    </ScrollView>
  );
};
export default ImageTextDetail;
