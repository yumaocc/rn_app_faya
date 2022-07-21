import {get} from './helper';
import {HomeStatisticsF} from '../models';

/**
 * @deprecated
 */
export async function loadStatistics(): Promise<HomeStatisticsF> {
  return await get<HomeStatisticsF>('/crm/home/mine/spus');
}
