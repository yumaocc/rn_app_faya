import {post, getPaged, get} from './helper';
import {Contract, ContractF, ContractList, PagedData, SearchParam} from '../models';

export async function createContract(form: ContractF): Promise<boolean> {
  return await post<boolean, ContractF>('/contract/sign/product', form);
}

export async function editContract(form: ContractF): Promise<boolean> {
  return await post<boolean, ContractF>('/contract/modify', form);
}

// 获取指定商家的合同列表
export async function getContractList(params: SearchParam): Promise<PagedData<ContractList[]>> {
  return await getPaged<ContractList[]>('/contract/list/with/biz', {params});
}

// 获取所有我的合同
export async function getMyContractList(params: SearchParam): Promise<PagedData<ContractList[]>> {
  return await getPaged<ContractList[]>('/contract/list/with/mine', {params});
}

export async function getContractDetail(id: number): Promise<Contract> {
  return await get<Contract>('/contract/details?id=' + id);
}
