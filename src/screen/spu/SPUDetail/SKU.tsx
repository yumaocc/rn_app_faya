import React from 'react';
import {Text, ScrollView, View} from 'react-native';
import {Footer, Form, FormTitle, SectionGroup, Switch} from '../../../component';
import {globalStyles} from '../../../constants/styles';
import {convertNumber2Han, findItem, getBuyLimitStr} from '../../../helper';
import {BoolEnum, ContractDetailF, MerchantDetailF, SPUDetailF} from '../../../models';
import {styles} from './style';

interface SKUProps {
  spuDetail?: SPUDetailF;
  merchantDetail?: MerchantDetailF;
  contractDetail?: ContractDetailF;
}

const SKU: React.FC<SKUProps> = props => {
  const {spuDetail, contractDetail} = props;

  const skuList = spuDetail?.skuList || [];
  const packList = spuDetail?.packageList || [];

  return (
    <ScrollView style={styles.container}>
      <SectionGroup style={styles.sectionGroupStyle}>
        <FormTitle title="套餐设置" />
        <Form.Item label="套餐总库存">
          <Text>{spuDetail?.stockAmount}</Text>
        </Form.Item>
        <Form.Item label="共享套餐库存">
          <Switch disabled checked={contractDetail?.skuInfoReq?.openSkuStock === BoolEnum.TRUE} />
        </Form.Item>
      </SectionGroup>
      {skuList.map((sku, index) => {
        const contractSKU = findItem(contractDetail?.skuInfoReq?.skuInfo, skuInfo => skuInfo.contractSkuId === sku.contractSkuId);
        const isShareStock = contractDetail?.skuInfoReq?.openSkuStock === BoolEnum.TRUE;
        return (
          <SectionGroup key={sku.skuId} style={styles.sectionGroupStyle}>
            <FormTitle title={`套餐${convertNumber2Han(index + 1)}信息`} />
            <Form.Item label="套餐名称">
              <Text>{sku.skuName}</Text>
            </Form.Item>
            <Form.Item label="套餐结算价（元）">
              <Text>{contractSKU?.skuSettlementPrice}</Text>
            </Form.Item>
            <Form.Item label="套餐原价（元）">
              <Text>{sku.originPrice}</Text>
            </Form.Item>
            <Form.Item label="套餐售价（元）">
              <Text>{sku.salePrice}</Text>
            </Form.Item>
            <Form.Item label="购买上限">
              <Text>{getBuyLimitStr(contractSKU?.buyLimitType, contractSKU?.buyLimitNum)}</Text>
            </Form.Item>
            <Form.Item
              label="套餐库存"
              extra={
                sku?.list?.length > 0 ? (
                  <View style={[{borderRadius: 5, backgroundColor: '#00000008', padding: 10}]}>
                    <FormTitle style={{backgroundColor: 'transparent'}} title={`套餐${convertNumber2Han(index + 1)}内容`} />
                    {sku?.list?.map((detail, index) => {
                      return (
                        <View style={[globalStyles.containerLR, {paddingVertical: 4}]} key={index}>
                          <Text>
                            {detail.nums}份{detail.name}
                          </Text>
                          <Text>{detail.price}元</Text>
                        </View>
                      );
                    })}
                  </View>
                ) : null
              }>
              <Text>{isShareStock ? '共享库存' : sku.skuStock || '-'}</Text>
            </Form.Item>
          </SectionGroup>
        );
      })}
      {packList.map((pack, index) => {
        return (
          <SectionGroup key={pack.id} style={styles.sectionGroupStyle}>
            <FormTitle title={`组合套餐${convertNumber2Han(index + 1)}信息`} />
            <View style={{padding: 10}}>
              <View>
                <Text style={globalStyles.fontSecondary}>名称：{pack?.packageName}</Text>
              </View>
              <View style={{paddingLeft: 20}}>
                {pack?.skus.map((skuDetail, index) => {
                  const foundSKU = findItem(spuDetail?.skuList, sku => sku.skuId === skuDetail.skuId);
                  return (
                    <View key={index}>
                      <Text style={globalStyles.fontTertiary}>{`${foundSKU?.skuName} * ${skuDetail.nums}`}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </SectionGroup>
        );
      })}
      <Footer />
    </ScrollView>
  );
};
SKU.defaultProps = {
  // title: 'SKU',
};
export default SKU;
