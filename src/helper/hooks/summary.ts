import {useRequest} from 'ahooks';
import {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {Commission, HomeStatisticsF} from '../../models';
import {RootState} from '../../redux/reducers';
import {useForceUpdate} from './common';
import {useSummaryDispatcher} from './dispatcher';
import * as api from '../../apis';
export function useHomeSummary(): [HomeStatisticsF, Commission, number, () => void] {
  const [signal, forceUpdate] = useForceUpdate();
  const homeData = useSelector((state: RootState) => state.summary.home);
  const commissionToday = useSelector((state: RootState) => state.summary.commissionToday);
  const [summaryDispatcher] = useSummaryDispatcher();
  const {data, run} = useRequest(async () => {
    return api.contract.getMyContractList({
      pageIndex: 1,
      pageSize: 10,
    });
  });
  useEffect(() => {
    if (!homeData) {
      summaryDispatcher.loadCommissionToday();
      summaryDispatcher.loadHome();
    }
  }, [homeData, summaryDispatcher]);

  useEffect(() => {
    if (signal) {
      run();
      summaryDispatcher.loadHome();
      summaryDispatcher.loadCommissionToday();
    }
  }, [run, signal, summaryDispatcher]);

  return [homeData, commissionToday, data?.page?.pageTotal, forceUpdate];
}
