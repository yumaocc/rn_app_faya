import React from 'react';
import {ScrollView, Image, TouchableOpacity, View} from 'react-native';
import {Form, FormTitle, SectionGroup} from '../../../component';
import {ContractDetailF, MerchantDetailF, SPUDetailF} from '../../../models';
import {styles} from './style';

interface ImageDetailProps {
  spuDetail?: SPUDetailF;
  merchantDetail?: MerchantDetailF;
  contractDetail?: ContractDetailF;
}

const ImageDetail: React.FC<ImageDetailProps> = props => {
  const {spuDetail} = props;
  return (
    <ScrollView style={styles.container}>
      <SectionGroup style={styles.sectionGroupStyle}>
        <FormTitle title="图片信息" />
        <Form.Item label="海报图" vertical>
          <ScrollView horizontal style={{height: 75}}>
            <TouchableOpacity activeOpacity={0.8}>
              <View>
                <Image source={{uri: spuDetail?.poster}} style={{width: 75, height: 75, borderRadius: 5}} />
              </View>
            </TouchableOpacity>
          </ScrollView>
        </Form.Item>
        <Form.Item label="详情banner图" vertical>
          <ScrollView horizontal style={{height: 75}}>
            {spuDetail?.bannerPhotos?.map((photo, index) => {
              return (
                <TouchableOpacity activeOpacity={0.8} key={index}>
                  <View style={{marginLeft: index === 0 ? 0 : 10}}>
                    <Image source={{uri: photo.url}} style={{width: 75, height: 75, borderRadius: 5}} />
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </Form.Item>
      </SectionGroup>
    </ScrollView>
  );
};
ImageDetail.defaultProps = {
  // title: 'ImageDetail',
};
export default ImageDetail;
