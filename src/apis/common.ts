import {LocationTreeF, Site} from '../models/common';
import {get, post} from './helper';

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

//站点
export async function getSites(): Promise<LocationTreeF[]> {
  const siteList: LocationTreeF[] = (await get('/location/with/company/two/list')) || [];
  return siteList.map((p, index) => {
    return {
      ...p,
      id: index + '_' + p.id,
    };
  });
}

// 获取三级城市信息
export async function getAllSites(): Promise<Site[]> {
  return await get<Site[]>('/location/with/company/three/list');
}
