import React, {useMemo} from 'react';
import {View, Text, ScrollView} from 'react-native';
import {Footer, Form, FormTitle, SectionGroup} from '../../../component';
import {globalStyles} from '../../../constants/styles';
import {convertSKUBuyNotice, findItem, getBookingType} from '../../../helper';
import {useCodeTypes, useMerchantBookingModel} from '../../../helper/hooks';
import {BookingType, BoolEnum, ContractDetailF, MerchantDetailF, SPUDetailF} from '../../../models';
import {styles} from './style';

interface BookingProps {
  spuDetail?: SPUDetailF;
  merchantDetail?: MerchantDetailF;
  contractDetail?: ContractDetailF;
}

const Booking: React.FC<BookingProps> = props => {
  const {spuDetail, contractDetail} = props;
  const needBooking = contractDetail?.bookingReq?.bookingType === BookingType.URL;
  const canCancelBooking = contractDetail?.bookingReq?.bookingCanCancel === BoolEnum.TRUE;
  const modelList = spuDetail?.modelList || [];

  const [merchantBookingModel] = useMerchantBookingModel(spuDetail?.bizUserId);
  const [codeType] = useCodeTypes();

  const currentCodeType = useMemo(() => {
    return findItem(codeType, codeType => codeType.codeType === contractDetail?.bookingReq?.codeType);
  }, [codeType, contractDetail?.bookingReq?.codeType]);
  const buyNotices = useMemo(() => convertSKUBuyNotice(spuDetail?.purchaseNoticeEntities || []), [spuDetail?.purchaseNoticeEntities]);

  return (
    <ScrollView style={styles.container}>
      <SectionGroup style={styles.sectionGroupStyle}>
        <FormTitle title="预约设置" />
        <Form.Item label="预约方式">
          <Text>{getBookingType(contractDetail?.bookingReq?.bookingType)}</Text>
        </Form.Item>
        {needBooking && (
          <>
            <Form.Item label="提前几天预约">
              <Text>{`提前${contractDetail?.bookingReq?.bookingEarlyDay || '-'}天`}</Text>
            </Form.Item>
            <Form.Item label="预约开始时间">
              <Text>{contractDetail?.bookingReq?.bookingBeginTime}</Text>
            </Form.Item>
            <Form.Item label="可取消预约">
              <Text>{canCancelBooking ? '是' : '否'}</Text>
            </Form.Item>
            {canCancelBooking && (
              <Form.Item label="提前几天取消预约">
                <Text>{`${contractDetail?.bookingReq?.bookingCancelDay || '-'}天`}</Text>
              </Form.Item>
            )}
          </>
        )}
        {modelList?.length > 0 && (
          <Form.Item label="绑定的预约型号" vertical>
            <View>
              {modelList.map((model, index) => {
                const bookingItem = findItem(merchantBookingModel, item => item.id === model.modelId);
                return (
                  <View key={index} style={[styles.modelCard]}>
                    <Text style={globalStyles.fontPrimary}>{bookingItem?.name}</Text>
                    {model.contractSkuIds?.map(skuId => {
                      const skuItem = findItem(contractDetail?.skuInfoReq?.skuInfo, item => item.contractSkuId === skuId);

                      return (
                        <Text key={skuId} style={globalStyles.fontTertiary}>
                          {skuItem?.skuName}
                        </Text>
                      );
                    })}
                  </View>
                );
              })}
            </View>
          </Form.Item>
        )}
      </SectionGroup>
      <SectionGroup style={styles.sectionGroupStyle}>
        <FormTitle title="发码设置" />
        <Form.Item label="发码方式">
          <Text>{currentCodeType?.name}</Text>
        </Form.Item>
      </SectionGroup>
      <SectionGroup style={styles.sectionGroupStyle}>
        <FormTitle title="购买须知设置" />
        {buyNotices?.BOOKING?.length > 0 && (
          <Form.Item label="预约须知" vertical>
            <View style={{backgroundColor: '#f2f2f2', borderRadius: 5, padding: 10}}>
              {buyNotices?.BOOKING?.map((item, index) => {
                return (
                  <View key={index} style={{paddingVertical: 5}}>
                    <Text numberOfLines={4}>{item}</Text>
                  </View>
                );
              })}
            </View>
          </Form.Item>
        )}
        {buyNotices?.SALE_TIME?.length > 0 && (
          <Form.Item label="营业时间" vertical>
            <View style={{backgroundColor: '#f2f2f2', borderRadius: 5, padding: 10}}>
              {buyNotices?.SALE_TIME?.map((item, index) => {
                return (
                  <View key={index} style={{paddingVertical: 5}}>
                    <Text numberOfLines={4}>{item}</Text>
                  </View>
                );
              })}
            </View>
          </Form.Item>
        )}
        {buyNotices?.USE_RULE?.length > 0 && (
          <Form.Item label="使用规则" vertical>
            <View style={{backgroundColor: '#f2f2f2', borderRadius: 5, padding: 10}}>
              {buyNotices?.USE_RULE?.map((item, index) => {
                return (
                  <View key={index} style={{paddingVertical: 5}}>
                    <Text numberOfLines={4}>{item}</Text>
                  </View>
                );
              })}
            </View>
          </Form.Item>
        )}
        {buyNotices?.POLICY?.length > 0 && (
          <Form.Item label="取消政策" vertical>
            <View style={{backgroundColor: '#f2f2f2', borderRadius: 5, padding: 10}}>
              {buyNotices?.POLICY?.map((item, index) => {
                return (
                  <View key={index} style={{paddingVertical: 5}}>
                    <Text numberOfLines={4}>{item}</Text>
                  </View>
                );
              })}
            </View>
          </Form.Item>
        )}
        {buyNotices?.TIPS?.length > 0 && (
          <Form.Item label="温馨提示" vertical>
            <View style={{backgroundColor: '#f2f2f2', borderRadius: 5, padding: 10}}>
              {buyNotices?.TIPS?.map((item, index) => {
                return (
                  <View key={index} style={{paddingVertical: 5}}>
                    <Text numberOfLines={4}>{item}</Text>
                  </View>
                );
              })}
            </View>
          </Form.Item>
        )}
      </SectionGroup>
      <Footer />
    </ScrollView>
  );
};
Booking.defaultProps = {
  // title: 'Booking',
};
export default Booking;
