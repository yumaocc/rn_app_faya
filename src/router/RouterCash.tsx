import React from 'react';
import {commonScreenOptions, Stack} from './config';
import Cash from '../screen/cash';
import Withdraw from '../screen/cash/Withdraw';
import Success from '../screen/cash/Success';
const RouterSPU = (
  <>
    <Stack.Screen name="Cash" component={Cash} options={commonScreenOptions} />
    <Stack.Screen name="Withdraw" component={Withdraw} options={commonScreenOptions} />
    <Stack.Screen name="Success" component={Success} options={commonScreenOptions} />
  </>
);

export default RouterSPU;
