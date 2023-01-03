import React, {useMemo} from 'react';
import {View, Text, ScrollView} from 'react-native';
import {Cascader, Footer, Form, FormTitle, SectionGroup} from '../../../component';
import {globalStyleVariables} from '../../../constants/styles';
import {findItem} from '../../../helper';
import {useSPUCategories} from '../../../helper/hooks';
import {ContractDetailF, MerchantDetailF, SPUDetailF} from '../../../models';
import {styles} from './style';

interface BaseProps {
  spuDetail?: SPUDetailF;
  merchantDetail?: MerchantDetailF;
  contractDetail?: ContractDetailF;
}

const Base: React.FC<BaseProps> = props => {
  const {spuDetail, merchantDetail, contractDetail} = props;
  const [SPUCategories] = useSPUCategories();

  const canUseShopList = useMemo(() => {
    const shopIDs = spuDetail?.canUseShopIds || [];
    return shopIDs.map(id => findItem(merchantDetail?.shopList, shop => shop.id === id)).filter(e => !!e);
  }, [merchantDetail, spuDetail]);

  return (
    <ScrollView style={styles.container}>
      <SectionGroup style={styles.sectionGroupStyle}>
        <FormTitle title="商家信息" />
        <Form.Item label="商家名称">
          <Text>{merchantDetail?.name}</Text>
        </Form.Item>
        <Form.Item label="合同">
          <Text>{contractDetail?.contractName}</Text>
        </Form.Item>
        <Form.Item label="可消费店铺" vertical>
          <View style={{backgroundColor: '#f2f2f2', borderRadius: 5}}>
            <Text style={{padding: globalStyleVariables.MODULE_SPACE}}>{`共${spuDetail?.canUseShopIds?.length || 0}家`}</Text>
            <View>
              {canUseShopList.map(shop => {
                return (
                  <View key={shop.id} style={[{padding: globalStyleVariables.MODULE_SPACE}]}>
                    <Text>{shop.shopName}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </Form.Item>
      </SectionGroup>

      <SectionGroup style={styles.sectionGroupStyle}>
        <FormTitle title="商品基础信息" />
        <Form.Item label="商品名称">
          <Text>{spuDetail?.spuName}</Text>
        </Form.Item>
        <Form.Item label="商品类型">
          <Cascader value={contractDetail?.spuInfoReq?.spuCategoryIds} disabled options={SPUCategories} labelKey="name" valueKey="id" placeholder="商品分类" />
        </Form.Item>
        <Form.Item label="初始销量" desc="为了xxx而显示的销量">
          <Text>{spuDetail?.baseSaleAmount}</Text>
        </Form.Item>
        <Form.Item label="初始分享数" desc="为了xxx而显示的数量">
          <Text>{spuDetail?.baseShareCount}</Text>
        </Form.Item>
      </SectionGroup>
      <SectionGroup style={styles.sectionGroupStyle}>
        <FormTitle title="上线时间" />
        <Form.Item label="售卖时间" vertical desc={`合同时间：${contractDetail?.bookingReq?.saleBeginTime || 'N/A'}-${contractDetail?.bookingReq?.saleEndTime || 'N/A'}`}>
          <View style={styles.composeItemWrapper}>
            <Form.Item label="开始时间" style={styles.composeItem} hiddenBorderBottom hiddenBorderTop>
              <Text>{spuDetail?.saleBeginTime}</Text>
            </Form.Item>
            <Form.Item label="结束时间" style={styles.composeItem} hiddenBorderBottom>
              <Text>{spuDetail?.saleEndTime}</Text>
            </Form.Item>
          </View>
        </Form.Item>
        <Form.Item label="使用时间" vertical desc={`合同日期：${contractDetail?.bookingReq?.useBeginTime || 'N/A'}-${contractDetail?.bookingReq?.useEndTime || 'N/A'}`}>
          <View style={styles.composeItemWrapper}>
            <Form.Item label="开始时间" style={styles.composeItem} hiddenBorderBottom hiddenBorderTop>
              <Text>{spuDetail?.useBeginTime}</Text>
            </Form.Item>
            <Form.Item label="结束时间" style={styles.composeItem} hiddenBorderBottom>
              <Text>{spuDetail?.useEndTime}</Text>
            </Form.Item>
          </View>
        </Form.Item>
        <Form.Item label="展示时间" desc="产品将于该时间上架并显示倒计时">
          <Text>{spuDetail?.showBeginTime || '-'}</Text>
        </Form.Item>
      </SectionGroup>
      <Footer />
    </ScrollView>
  );
};
Base.defaultProps = {
  // title: 'Base',
};
export default Base;
