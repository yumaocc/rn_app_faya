export function getBaseURL(): string {
  return 'https://api-beta-b-gateway.faya.life/crm-service'; // 测试
  if (__DEV__) {
  }
  return 'https://api-b-gateway.faya.life/crm-service'; // 生产
}
