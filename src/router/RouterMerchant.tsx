import React from 'react';
import {commonScreenOptions, Stack} from './config';
import AddMerchant from '../screen/merchant/Add';
import {MerchantCreateType} from '../models';
const RouterMerchant = (
  <>
    <Stack.Screen name="AddMerchant" component={AddMerchant} initialParams={{type: MerchantCreateType.PUBLIC_SEA}} options={commonScreenOptions} />
  </>
);

export default RouterMerchant;
