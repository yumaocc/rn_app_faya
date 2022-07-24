import {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {HomeStatisticsF} from '../../models';
import {RootState} from '../../redux/reducers';
import {useForceUpdate} from './common';
import {useSummaryDispatcher} from './dispatcher';

export function useHomeSummary(): [HomeStatisticsF, () => void] {
  const [signal, forceUpdate] = useForceUpdate();
  const homeData = useSelector((state: RootState) => state.summary.home);
  const [summaryDispatcher] = useSummaryDispatcher();

  useEffect(() => {
    if (!homeData) {
      summaryDispatcher.loadHome();
    }
  }, [homeData, summaryDispatcher]);

  useEffect(() => {
    if (signal) {
      summaryDispatcher.loadHome();
    }
  }, [signal, summaryDispatcher]);

  return [homeData, forceUpdate];
}
