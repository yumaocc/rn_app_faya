import {get, post, getPaged} from './helper';
import {
  IDBody,
  MerchantBookingModelF,
  MerchantCategory,
  MerchantDetailF,
  MerchantF,
  MerchantForm,
  MyMerchantF,
  MyMerchantSimpleF,
  PagedData,
  SearchParam,
  ShopF,
  ShopForm,
  Site,
} from '../models';

// 获取公海商家（分页）
export async function getPublicSeaMerchants(params: SearchParam): Promise<PagedData<MerchantF[]>> {
  return await getPaged<MerchantF[]>('/biz/user/broad/ocean/page', {params});
}

// 获取私海商家（分页）
export async function getPrivateSeaMerchants(params: SearchParam): Promise<PagedData<MerchantF[]>> {
  return await getPaged<MerchantF[]>('/biz/user/my/broad/ocean/page', {
    params,
  });
}

// 获取我的商家（分页）
export async function getMyMerchants(params: SearchParam): Promise<PagedData<MyMerchantF[]>> {
  return await getPaged<MyMerchantF[]>('/biz/user/mine/page', {params});
}
// 获取我的商家（轻量，返回部分数据）
export async function getMyMerchantSimple(params: SearchParam): Promise<PagedData<MyMerchantSimpleF[]>> {
  return await getPaged<MyMerchantSimpleF[]>('/biz/user/mine/page/simple', {
    params,
  });
}

// 获取商户分类
export async function getMerchantCategories(): Promise<MerchantCategory[]> {
  return await get<MerchantCategory[]>('/biz/user/category/list');
}

// 创建商户
export async function createMerchant(merchant: MerchantForm): Promise<boolean> {
  console.log('创建商户请求参数', merchant);
  return await post<boolean, MerchantForm>('/biz/user/add/one', merchant);
}

// 领取到我的私海
export async function drawMerchant(merchantId: number): Promise<boolean> {
  return await post('/biz/user/add/to/my/broad/ocean', {id: merchantId});
}

// 获取私海商家详情
export async function getMerchantDetail(merchantId: number): Promise<MerchantDetailF> {
  return await get<MerchantDetailF>(`/biz/user/details?id=${merchantId}`);
}

// 获取公海商家详情
export async function getPublicMerchantDetail(merchantId: number): Promise<MerchantDetailF> {
  return await get<MerchantDetailF>(`/biz/user/details/for/public?id=${merchantId}`);
}
export async function returnPublic(id: number): Promise<boolean> {
  return await post<boolean, {id: number}>('/biz/user/del/my/broad/ocean', {id});
}

// 修改商户信息
export async function updateMerchant(merchant: MerchantForm): Promise<boolean> {
  return await post<boolean, MerchantForm>('/biz/user/modify', merchant);
}

// 新增店铺
export async function createShop(shop: ShopForm, merchantId: number): Promise<boolean> {
  return await post<boolean, ShopForm & {bizUserId: number}>('/biz/user/shop/add/one', {
    ...shop,
    bizUserId: merchantId,
  });
}

// 修改店铺
export async function modifyShop(shop: ShopF): Promise<boolean> {
  return await post<boolean, ShopF>('/biz/user/shop/modify/one', shop);
}

// 删除店铺
export async function deleteShop(shopId: number): Promise<boolean> {
  return await post<boolean, IDBody>('/biz/user/shop/delete/one', {
    id: shopId,
  });
}

// 查询指定商家的店铺
export async function getShops(merchantId: number): Promise<ShopF[]> {
  return await get<ShopF[]>(`/biz/user/shop/list?id=${merchantId}`);
}

// 获取商家的预约型号
export async function getMerchantBookingModel(merchantId: number): Promise<MerchantBookingModelF[]> {
  return await get<MerchantBookingModelF[]>(`/sku/model/list/with/biz?id=${merchantId}`);
}

// 添加预约型号
export async function addMerchantBookingModel(name: string, merchantId: number): Promise<boolean> {
  return await post('/sku/model/add/one', {
    bizUserId: merchantId,
    name,
  });
}

export async function deleteMerchantBookingModel(modelId: number): Promise<boolean> {
  return await post('/sku/model/del/one', {
    id: modelId,
  });
}

// 邀请商户认证
export async function inviteAuth(merchantId: number): Promise<boolean> {
  return await post<boolean, IDBody>('/biz/user/initiate/authentication', {
    id: merchantId,
  });
}
// 城市列表,三级分类
export async function cityList(): Promise<Site[]> {
  return await get('/location/with/company/three/list');
}

// 站点
export async function getLocationWithCompanyId() {
  return await get('/location/with/company/all');
}
