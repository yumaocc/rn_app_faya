import React, {useEffect} from 'react';
import moment from 'moment';
import {FC} from 'react';
import * as apis from '../../../apis';
const HistoricalEarnings: FC = () => {
  useEffect(() => {
    const start = moment().startOf('month');
    const end = moment().endOf('month');
    apis.user
      .getHistoricalIncome({
        beginTime: start,
        endTime: end,
      })
      .then(res => {
        console.log(res);
      })
      .catch(err => console.log(err));
  }, []);
  return <></>;
};

export default HistoricalEarnings;
