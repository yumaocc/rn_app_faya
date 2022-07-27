import {post} from './helper';

export async function uploadImage(file: any): Promise<string> {
  console.log(file);
  return '上传接口未实现';
  // const formData = new FormData();
  // formData.append('file', file);
  // return await post('/common/file/upload', formData);
}

export async function uploadToOSS(uri: string, fileName: string): Promise<string> {
  const formData = new FormData();
  const file = {uri, type: 'multipart/form-data', name: fileName};
  formData.append('file', file);
  return await post('/common/file/upload', formData);
}
