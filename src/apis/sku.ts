import {get, getPaged, post} from './helper';
import qs from 'qs';
import {PagedData, SearchParam, SKUBuyNoticeF, SPUF, SPUCategory, SPUCodeType, SPUForm, SPUDetailF, BeginTimeAndEndTime, SalesList, SaleParams, SaleType} from '../models';
// import {wait} from '../helper';

// 获取spu分类
export async function getSPUCategories(): Promise<SPUCategory[]> {
  return await get<SPUCategory[]>('/spu/category/list');
}

// 获取发码方式
export async function getCodeTypes(): Promise<SPUCodeType[]> {
  return await get<SPUCodeType[]>('/sku/code/type/all');
}

// 获取购买须知
export async function getSKUBuyNotice(): Promise<SKUBuyNoticeF[]> {
  let data: SKUBuyNoticeF[] = await get<SKUBuyNoticeF[]>('/purchase/notice/template/list');
  return data;
}

// 获取spu列表
export async function getSPUList(params: SearchParam): Promise<PagedData<SPUF[]>> {
  // function mockData(): SPUF[] {
  //   const res: SPUF[] = [];
  //   let id = Date.now();
  //   for (let i = 0; i < params.pageSize; i++) {
  //     const spu = {
  //       id: id + i,
  //       spuName: '测试spu' + id,
  //       poster: 'https://fakeimg.pl/10?text=fake',
  //       statusStr: '上架中',
  //       bizName: '测试' + id,
  //       bookTypeStr: 'asd',
  //       bookingType: BookingType.PHONE,
  //       categoryName: '美食/酒店/XX',
  //       hasSoldout: BoolEnum.FALSE,
  //       saleBeginTime: '2022-01-01 00:00:00',
  //       saleEndTime: '2022-01-01 00:00:00',
  //       skuList: mockSKU(id),
  //     };
  //     res.push(spu);
  //   }
  //   return res;
  // }
  // function mockSKU(id: number) {
  //   const res = [];
  //   for (let i = 0; i < 10; i++) {
  //     const sku = {
  //       skuId: id + i,
  //       skuName: '测试sku' + id,
  //       saleAmount: 100,
  //       skuStock: 1000,
  //       skuSettlePrice: 1000, // 结算价
  //       skuRemainingStock: 20,
  //       skuSalePrice: 32,
  //     };
  //     res.push(sku);
  //   }
  //   return res;
  // }
  // await wait(100);
  // const data = Math.random() > 0.1 ? mockData() : []; // 模拟加载完所有数据，几率10%
  // return {
  //   content: data,
  // };
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

//获取商品销售前十
export async function getMerchandiseTopTen(params?: BeginTimeAndEndTime): Promise<{content: SalesList[]}> {
  return await get(`sku/commission/top/ten?${qs.stringify(params)}`);
}
//获取提成前十
export async function getPushMoneyTopTen(params?: BeginTimeAndEndTime): Promise<{content: SalesList[]}> {
  return await get(`sku/commission/top/ten/income?${qs.stringify(params)}`);
}

//获取销售佣金
// salePrice : 套餐售价
//settlePrice： 门售价
export async function getSalePrice(price: SaleParams): Promise<SaleType> {
  console.log('请求参数', price);
  return await post<SaleType, SaleParams>('/spu/find/commission/by/price', price);
}
