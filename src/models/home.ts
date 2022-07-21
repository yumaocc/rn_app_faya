// F 代表从后端返回的数据类型
export interface HomeStatisticsF {
  myBizUsers: number;
  muSpus: number;
  privateSeaLimit: number;
  privateSeaNums: number;
}
/**
 * @deprecated
 */
export interface Statistics {
  home: HomeStatisticsF;
}
