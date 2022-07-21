import {post} from './helper';

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  return await post('/common/file/upload', formData);
}
