import React, {useCallback, useEffect, useMemo} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {useLog, useRNSelectPhoto} from '../../../helper/hooks';
import * as api from '../../../apis';
import uniqueId from 'lodash/uniqueId';

interface URLFile {
  [key: string]: string;
}
export interface UploadFile {
  url?: string;
  uid: string;
  uri?: string;
  name?: string;
  state?: 'success' | 'uploading';
  // size?: number;
}

type Value = string[] | string | URLFile | URLFile[] | any;

interface UploadProps {
  value?: Value;
  maxCount?: number; // 0 代表不限制

  /**
   * @description value类型 默认为 urls
   * @property {string} url - 单个url地址，如'https://xxx.com/xxx.png'
   * @property {string} urls - (默认值)多个url数组，如 ['https://xxx.com/xxx.png', 'https://xxx.com/xxx.png']
   * @property {string} urlObject - 单个文件对象，如{url: 'https://xxx.com/xxx.png'}
   * @property {string[]} urlObjects - 多个文件对象数组，如[{url: 'https://xxx.com/xxx.png'}, {url: 'https://xxx.com/xxx.png'}]
   */
  valueType?: 'url' | 'urls' | 'urlObjects' | 'urlObject';

  /**
   * @description value的url键名，当valueType为urlObject或urlObjects时有效，默认为 url
   */
  valueKey?: string;
  onChange?: (value: Value) => void;
}

const Upload: React.FC<UploadProps> = props => {
  const {maxCount, value, valueKey, valueType, onChange} = props;
  const [fileList, setFileList] = React.useState<UploadFile[]>([]);
  const [selectPhotos] = useRNSelectPhoto();
  const isLimited = useMemo(() => {
    if (maxCount === 0) {
      return false;
    }
    return fileList.length >= maxCount;
  }, [maxCount, fileList]);

  const handleFileChange = useCallback(
    (fileList: UploadFile[]): void => {
      let newValue: Value;
      switch (valueType) {
        case 'url':
          newValue = fileList[0]?.url;
          break;
        case 'urls':
          newValue = fileList.map(item => item.url);
          break;
        case 'urlObject':
          newValue = {[valueKey]: fileList[0]?.url};
          break;
        case 'urlObjects':
          newValue = fileList.map(item => ({[valueKey]: item.url}));
          break;
      }
      if (onChange) {
        onChange(newValue);
      }
    },
    [onChange, valueKey, valueType],
  );
  useLog(fileList);

  const addFile = useCallback((file: UploadFile) => {
    setFileList(prev => [...prev, file]);
  }, []);

  const updateFile = useCallback(
    (uid: string, partial: Partial<UploadFile>) => {
      console.log(fileList);
      const newFileList = fileList.map(file => {
        if (file.uid === uid) {
          return {...file, ...partial};
        }
        return file;
      });
      console.log('newFileList', newFileList);
      handleFileChange(newFileList);
      setFileList(newFileList);
    },
    [fileList, handleFileChange],
  );

  // 将value同步为fileList
  useEffect(() => {
    let newUrlList: string[] = [];
    let temp; // 临时变量
    switch (valueType) {
      case 'url':
        temp = value as string;
        if (temp) {
          newUrlList = [temp];
        }
        break;
      case 'urls':
        temp = value as string[];
        newUrlList = temp;
        break;
      case 'urlObject':
        temp = value as URLFile;
        if (temp) {
          newUrlList = [temp[valueKey]];
        }
        break;
      case 'urlObjects':
        temp = value as URLFile[];
        newUrlList = temp.map(item => item[valueKey]);
        break;
    }
    setFileList(
      newUrlList.map((url, index) => {
        return {
          uid: String(index),
          name: `image-${index}`,
          url,
        };
      }),
    );
  }, [value, valueKey, valueType, setFileList]);

  async function handleClickAdd() {
    if (isLimited) {
      return;
    }
    const restCount = maxCount - fileList.length;
    const results = await selectPhotos({selectionLimit: restCount});
    results.forEach(async asset => {
      const {uri, fileName} = asset;
      const uid = uniqueId('upload-');
      addFile({
        uid,
        uri,
        name: fileName,
        url: '',
        state: 'uploading',
      });
      try {
        const ossURL = await api.common.uploadToOSS(uri, fileName);
        updateFile(uid, {url: ossURL});
      } catch (error) {}
    });
  }

  return (
    <View style={styles.container}>
      {fileList.map((file, index) => {
        const uri = file.uri || file.url;
        return (
          <View style={styles.block} key={`${file.uid}-${index}`}>
            <Image source={{uri}} style={styles.image} />
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
    </View>
  );
};
Upload.defaultProps = {
  maxCount: 0,
  valueKey: 'url',
  valueType: 'urls',
};
export default Upload;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  block: {
    width: 75,
    height: 75,
    overflow: 'hidden',
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  image: {
    width: 75,
    height: 75,
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
});
