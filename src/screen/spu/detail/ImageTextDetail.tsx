import {Button} from '@ant-design/react-native';
import React from 'react';
import {View, ScrollView} from 'react-native';
import {Form, FormTitle, SectionGroup} from '../../../component';
import {styles} from '../style';
import {useRNSelectPhoto} from '../../../helper/hooks';
import Upload, {UploadFile} from '../../../component/Form/Upload';

interface ImageTextDetailProps {
  onNext?: () => void;
}

const ImageTextDetail: React.FC<ImageTextDetailProps> = ({onNext}) => {
  const form = Form.useFormInstance();
  const [openGallery] = useRNSelectPhoto();

  const [files, setFiles] = React.useState<UploadFile[]>([{url: 'https://fakeimg.pl/100?text=8', uid: 'simon1'}]);
  // function handleFileChange(files: any) {
  //   setFiles(files);
  // }
  async function handleOpenGallery() {
    try {
      const result = await openGallery();
      console.log(result);
    } catch (error) {
      console.log('error');
      console.log(error);
    }
  }

  function onCheck() {
    console.log(form.getFieldsValue());
    onNext && onNext();
  }
  return (
    <ScrollView style={styles.container}>
      <SectionGroup style={styles.sectionGroupStyle}>
        <FormTitle title="图片信息" />
        <Button onPress={handleOpenGallery}>选择相册图片</Button>
        {/* <ImagePicker files={files} onChange={handleFileChange} /> */}
        <Upload
          maxCount={6}
          valueType="urlObjects"
          value={files}
          onChange={value => {
            console.log('on change');
            console.log(value);
            setFiles(value);
          }}
        />
      </SectionGroup>
      <View style={styles.button}>
        <Button type="primary" onPress={onCheck}>
          下一步
        </Button>
      </View>
    </ScrollView>
  );
};
// ImageTextDetail.defaultProps = {
//   title: 'ImageTextDetail',
// };
export default ImageTextDetail;
