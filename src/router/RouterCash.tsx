import React from 'react';
import {commonScreenOptions, Stack} from './config';
import Cash from '../screen/cash';
import Withdraw from '../screen/cash/Withdraw';
import Success from '../screen/cash/Success';
import WithdrawalsRecord from '../screen/cash/WithdrawalsRecord';
import EstimatedIncome from '../screen/cash/statistics/EstimatedIncome';
import HistoricalEarnings from '../screen/cash/statistics/HistoricalEarnings';
import TodayEarnings from '../screen/cash/statistics/TodayEarnings';
import SalesTopList from '../screen/cash/rank/SalesTopList';
import CommodityTopList from '../screen/cash/rank/CommodityTopList';

const RouterSPU = (
  <>
    <Stack.Screen name="Cash" component={Cash} options={commonScreenOptions} />
    <Stack.Screen name="Withdraw" component={Withdraw} options={commonScreenOptions} />
    <Stack.Screen name="Success" component={Success} options={commonScreenOptions} />
    <Stack.Screen name="WithdrawalsRecord" component={WithdrawalsRecord} options={commonScreenOptions} />
    <Stack.Screen name="EstimatedIncome" component={EstimatedIncome} options={commonScreenOptions} />
    <Stack.Screen name="HistoricalEarnings" component={HistoricalEarnings} options={commonScreenOptions} />
    <Stack.Screen name="TodayEarnings" component={TodayEarnings} options={commonScreenOptions} />
    <Stack.Screen name="SalesTopList" component={SalesTopList} options={commonScreenOptions} />
    <Stack.Screen name="CommodityTopList" component={CommodityTopList} options={commonScreenOptions} />
  </>
);
export default RouterSPU;
