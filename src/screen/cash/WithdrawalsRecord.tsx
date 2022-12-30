//提现记录
import React, {useState} from 'react';
import {FC} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ListView} from '@ant-design/react-native';
import * as apis from '../../apis';
import {NavigationBar, SectionGroup} from '../../component';
import {UserWithdrawalRecord, UserWithdrawalRecordStatus} from '../../models';
import {globalStyles} from '../../constants/styles';
import CutOffRule from '../../component/CutOffRule';
import {SafeAreaView} from 'react-native-safe-area-context';
type StartFetchFunction = (rowData: any[], pageSize: number) => void;
type abortFetchFunction = () => void;

const WithdrawalsRecord: FC = () => {
  const [len, setLen] = useState(false);

  async function fetchData(pageIndex = 1, startFetch: StartFetchFunction, abortFetch: abortFetchFunction) {
    try {
      const pageSize = 10;
      const res = await apis.user.getWithdrawalRecords({pageIndex, pageSize});
      if (res.content.length > 0) {
        setLen(true);
      }
      const item = [
        {
          moneyYuan: '1231',
          createdTime: '2022-12-01 20:12',
          status: 1,
        },
        {
          moneyYuan: '1231',
          createdTime: '2022-12-01 20:12',
          status: 1,
        },
        {
          moneyYuan: '1231',
          createdTime: '2022-12-01 20:12',
          status: 1,
        },
        {
          moneyYuan: '1231',
          createdTime: '2022-12-01 20:12',
          status: 1,
        },
        {
          moneyYuan: '1231',
          createdTime: '2022-12-01 20:12',
          status: 1,
        },
        {
          moneyYuan: '1231',
          createdTime: '2022-12-01 20:12',
          status: 1,
        },
        {
          moneyYuan: '1231',
          createdTime: '2022-12-01 20:12',
          status: 1,
        },
        {
          moneyYuan: '1231',
          createdTime: '2022-12-01 20:12',
          status: 1,
        },
        {
          moneyYuan: '1231',
          createdTime: '2022-12-01 20:12',
          status: 1,
        },
        {
          moneyYuan: '1231',
          createdTime: '2022-12-01 20:12',
          status: 1,
        },
        {
          moneyYuan: '1231',
          createdTime: '2022-12-01 20:12',
          status: 1,
        },
        {
          moneyYuan: '1231',
          createdTime: '2022-12-01 20:12',
          status: 1,
        },
      ];
      setLen(true);
      const rowData = res.content;
      startFetch(item, pageSize);
    } catch (error) {
      abortFetch();
    }
  }

  const renderItem = (item: UserWithdrawalRecord) => {
    return (
      <>
        <View style={[globalStyles.containerLR]}>
          <Text style={[globalStyles.fontPrimary]}>提现到银行卡</Text>
          <Text style={[globalStyles.fontPrimary]}>{item?.moneyYuan}</Text>
        </View>
        <View style={[globalStyles.containerLR, globalStyles.moduleMarginTop]}>
          <Text style={[globalStyles.fontTertiary]}>{item?.createdTime}</Text>
          {UserWithdrawalRecordStatus.CHECKING === item?.status && <Text style={[globalStyles.fontTertiary]}>审核中</Text>}
          {UserWithdrawalRecordStatus.CHECKED === item?.status && <Text style={[globalStyles.fontTertiary]}>审核通过</Text>}
          {UserWithdrawalRecordStatus.REJECTED === item?.status && <Text style={[globalStyles.fontTertiary]}>审核不通过</Text>}
          {UserWithdrawalRecordStatus.TRANSFERRED === item?.status && <Text style={[globalStyles.fontTertiary]}>已转账</Text>}
          {UserWithdrawalRecordStatus.TRANSFER_FAILED === item?.status && <Text style={[globalStyles.fontTertiary]}>转账失败</Text>}
        </View>
        <CutOffRule />
      </>
    );
  };
  return (
    <>
      <SafeAreaView style={globalStyles.wrapper} edges={['bottom']}>
        <NavigationBar title="提现记录" />
        {/* {len ? ( */}
        <SectionGroup style={styles.sectionGroup}>
          <ListView refreshViewStyle={styles.freshHeader} renderItem={renderItem} onFetch={fetchData} keyExtractor={key => key.id + ''} numColumns={1} />
        </SectionGroup>
        {/* ) : (
        <View style={[{flex: 1}, globalStyles.containerCenter]}>
          <Text>暂时没有提现记录</Text>
        </View>
        )} */}
      </SafeAreaView>
    </>
  );
};

export default WithdrawalsRecord;

export const styles = StyleSheet.create({
  sectionGroup: {
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    paddingTop: 13,
  },
  freshHeader: {
    height: 50,
  },
});
