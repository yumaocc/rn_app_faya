import React, {useState} from 'react';
import {View, TouchableOpacity, Image} from 'react-native';
import * as ImagePicker from 'react-native-image-crop-picker';

interface Props {
  callBackImage: any;
  style: any;
}
const pxToDp = (number: number) => {
  return number;
};

const Index = (props: Props) => {
  const [image, setImage] = useState({path: ''});
  const [isShow, setIsShow] = useState(false);

  /**
   * 选择图片
   */
  const pickImage = () => {
    // ImagePicker.openPicker({
    //   width: pxToDp(96),
    //   height: pxToDp(96),
    //   mediaType: 'photo',
    // }).then(image => {
    //   setImage(image);
    //   setIsShow(true);
    //   props.callBackImage(image);
    // });
  };

  const pickView = () => {
    return (
      <TouchableOpacity
        style={{
          borderStyle: 'dashed',
          borderColor: 'black',
          width: pxToDp(96),
          height: pxToDp(96),
          borderWidth: 1,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 0.1,
        }}
        onPress={pickImage}>
        增加图片
      </TouchableOpacity>
    );
  };

  /**
   * 缩略图展示
   * @returns
   */
  const thumbnailView = () => {
    return (
      <View>
        <Image style={{width: pxToDp(96), height: pxToDp(96), borderRadius: 10}} source={{uri: image.path}} />
        <TouchableOpacity
          style={{width: pxToDp(20), position: 'absolute', top: pxToDp(-10), left: pxToDp(86)}}
          onPress={() => {
            setIsShow(!isShow);
            props.callBackImage(null);
          }}>
          <Image style={{width: pxToDp(20), height: pxToDp(20)}} source={require('@/res/images/x.png')} />
        </TouchableOpacity>
      </View>
    );
  };

  return <View style={[props.style, {width: pxToDp(110), height: pxToDp(110)}]}>{isShow ? thumbnailView() : pickView()}</View>;
};

Index.defaultProps = {
  callBackImage: () => {},
  style: {},
};

export default Index;
