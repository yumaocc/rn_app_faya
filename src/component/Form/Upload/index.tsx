import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, Animated, Modal} from 'react-native';
import {useRNSelectPhoto, useInfinityRotate} from '../../../helper/hooks';
import * as api from '../../../apis';
import uniqueId from 'lodash/uniqueId';
import {Icon as AntdIcon} from '@ant-design/react-native';
import {globalStyles} from '../../../constants/styles';
import Icon from '../Icon';
import ImageViewer from 'react-native-image-zoom-viewer';

export interface UploadFile {
  url?: string;
  uid: string;
  uri?: string;
  name?: string;
  state?: 'success' | 'uploading';
  // size?: number;
}

type Value = UploadFile[];

interface UploadProps {
  value?: Value;
  maxCount?: number; // 0 代表不限制
  onChange?: (value: Value) => void;
  disabled?: boolean;
}

const Upload: React.FC<UploadProps> = props => {
  const {maxCount, value, onChange, disabled} = props;
  const [showPreview, setShowPreview] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewIndex, setPreviewIndex] = React.useState(0);
  const rotateDeg = useInfinityRotate();
  const [selectPhotos] = useRNSelectPhoto();
  const isLimited = useMemo(() => {
    if (maxCount === 0) {
      return false;
    }
    return fileList.length >= maxCount;
  }, [maxCount, fileList]);

  const handleFileChange = useCallback(
    (fileList: UploadFile[]): void => {
      if (onChange) {
        onChange(fileList);
      }
    },
    [onChange],
  );

  // 将value同步为fileList
  useEffect(() => {
    setFileList(value || []);
  }, [value]);

  async function handleClickAdd() {
    if (isLimited) {
      return;
    }
    if (disabled) {
      return;
    }
    const restCount = maxCount - fileList.length;
    const results = await selectPhotos({selectionLimit: restCount});
    if (results.length === 0) {
      // 没有选择照片
      return;
    }
    const originFileList = fileList;
    let newFileList = results.map(asset => {
      const {uri, fileName} = asset;
      const uid = uniqueId('upload-');
      return {
        uid,
        uri,
        name: fileName,
        url: '',
        state: 'uploading',
      } as UploadFile;
    });
    // fixme: 如果一张图片未上传完成，然后立刻选择另一张图片，会出现问题。
    // 所以最好不要直接setFileList，用回调函数的形式去更新
    setFileList([...originFileList, ...newFileList]);
    const uploadedFileList: UploadFile[] = await Promise.all(
      newFileList.map(async file => {
        const {uri, name} = file;
        const url = await api.common.uploadToOSS(uri, name);
        return {...file, url, state: 'success'};
      }),
    );
    newFileList = [...originFileList, ...uploadedFileList];
    setFileList(newFileList);
    handleFileChange(newFileList);
  }
  const handleClick = (index: number) => {
    setFileList(fileList => fileList.filter((item, idx) => index !== idx));
  };
  const previewList = useMemo(() => {
    let list: {url: string}[] = [];
    fileList?.forEach(item => list.push({url: item?.uri}));
    return list;
  }, [fileList]);

  return (
    <View style={styles.container}>
      {fileList.map((file, index) => {
        const uri = file.uri || file.url;
        return (
          <View style={[globalStyles.containerLR, {position: 'relative'}]}>
            <View style={styles.block} key={`${file.uid}-${index}`}>
              <View style={[globalStyles.containerLR, {flex: 1, width: 100}]}>
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => {
                    if (!disabled) {
                      setPreviewIndex(index);
                      setShowPreview(true);
                    }
                  }}>
                  <Image source={{uri}} style={styles.image} />
                </TouchableOpacity>
              </View>

              {file.state === 'uploading' && (
                <View style={styles.uploading}>
                  <Animated.View style={{transform: [{rotate: rotateDeg}]}}>
                    <AntdIcon name="loading-3-quarters" />
                  </Animated.View>
                </View>
              )}
            </View>
            {disabled ? null : (
              <TouchableOpacity
                style={styles.wrapperIcon}
                activeOpacity={0.5}
                onPress={() => {
                  if (!disabled) {
                    handleClick(index);
                  }
                }}>
                <Icon name="del" color="red" />
              </TouchableOpacity>
            )}
          </View>
        );
      })}
      {!isLimited && (
        <TouchableOpacity onPress={handleClickAdd}>
          <View style={[styles.block, styles.button]}>
            <Text style={styles.plus}>+</Text>
          </View>
        </TouchableOpacity>
      )}
      <Modal visible={showPreview} transparent={true} animationType="fade" onRequestClose={() => setShowPreview(false)}>
        <ImageViewer imageUrls={previewList} index={previewIndex} enableSwipeDown={true} onSwipeDown={() => setShowPreview(false)} />
      </Modal>
    </View>
  );
};
Upload.defaultProps = {
  maxCount: 0,
  value: [],
};
export default Upload;
const blockSize = {width: 75, height: 75};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  block: {
    ...blockSize,
    overflow: 'hidden',
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  image: {
    ...blockSize,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0000000D',
  },
  plus: {
    fontSize: 30,
    fontWeight: '100',
    color: '#333',
  },
  uploading: {
    position: 'absolute',
    left: 0,
    top: 0,
    ...blockSize,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0000002D',
  },
  wrapper: {
    position: 'relative',
  },
  wrapperIcon: {
    position: 'absolute',
    top: -15,
    right: 0,
  },
});
