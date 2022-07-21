import {get, getPaged, post} from './helper';
import {convertSKUBuyNotice} from '../helper/sku';
import {
  PagedData,
  SearchParam,
  SKUBuyNotice,
  SKUBuyNoticeF,
  SPUF,
  SPUCategory,
  SPUCodeType,
  SPUForm,
  SPUDetailF,
} from '../models';

// 获取spu分类
export async function getSPUCategories(): Promise<SPUCategory[]> {
  return await get<SPUCategory[]>('/spu/category/list');
}

// 获取发码方式
export async function getCodeTypes(): Promise<SPUCodeType[]> {
  return await get<SPUCodeType[]>('/sku/code/type/all');
}

// 获取购买须知
export async function getSKUBuyNotice(): Promise<SKUBuyNotice> {
  let data: SKUBuyNoticeF[] = await get<SKUBuyNoticeF[]>(
    '/purchase/notice/template/list',
  );
  return convertSKUBuyNotice(data);
}

// 获取spu列表
export async function getSPUList(
  params: SearchParam,
): Promise<PagedData<SPUF[]>> {
  return await getPaged<SPUF[]>('/spu/list', {params});
}

// 获取微信文章内容
export async function getWXArticle(url: string): Promise<string> {
  return await get<string>('/spu/html/transfer/url?url=' + url);
}

// 新增商品
export async function createSPU(spu: SPUForm): Promise<boolean> {
  return await post<boolean, SPUForm>('/spu/add', spu);
}
// 编辑商品
export async function updateSPU(spu: SPUForm): Promise<boolean> {
  return await post<boolean, SPUForm>('/spu/modify', spu);
}

// 获取商品详情
export async function getSPUDetail(id: number): Promise<SPUDetailF> {
  return await get<SPUDetailF>('/spu/details?id=' + id);
}
