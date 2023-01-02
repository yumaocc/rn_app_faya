import {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {PAGE_SIZE} from '../../constants';
import {Commission, HomeStatisticsF, RequestAction} from '../../models';
import {RootState} from '../../redux/reducers';
import {useForceUpdate} from './common';
import {useSummaryDispatcher, useContractDispatcher} from './dispatcher';

export function useHomeSummary(): [HomeStatisticsF, Commission, number, () => void] {
  const [signal, forceUpdate] = useForceUpdate();
  const [contractDispatcher] = useContractDispatcher();
  const homeData = useSelector((state: RootState) => state.summary.home);
  const contractLen = useSelector<RootState, number>(state => state?.contract?.contractList?.page?.pageTotal);
  const commissionToday = useSelector((state: RootState) => state.summary.commissionToday);
  const [summaryDispatcher] = useSummaryDispatcher();

  useEffect(() => {
    if (!homeData) {
      contractDispatcher.loadContractList({pageIndex: 1, pageSize: PAGE_SIZE, action: RequestAction.load});
      summaryDispatcher.loadCommissionToday();
      summaryDispatcher.loadHome();
    }
  }, [contractDispatcher, homeData, summaryDispatcher]);

  useEffect(() => {
    if (signal) {
      summaryDispatcher.loadHome();
      summaryDispatcher.loadCommissionToday();
    }
  }, [contractDispatcher, signal, summaryDispatcher]);

  return [homeData, commissionToday, contractLen, forceUpdate];
}
