import React from 'react';
import {commonScreenOptions, Stack} from './config';
import AddMerchant from '../screen/merchant/Add';
import {MerchantCreateType} from '../models';
import ViewMerchant from '../screen/merchant/View';
import MyMerchantDetail from '../screen/merchant/my/MyMerchantDetail';
import ShopList from '../screen/merchant/my/MyMerchantDetail/ShopInfo/ShopList';
import ShopDetail from '../screen/merchant/my/MyMerchantDetail/ShopInfo/ShopDetail';
const RouterMerchant = (
  <>
    <Stack.Screen name="AddMerchant" component={AddMerchant} initialParams={{type: MerchantCreateType.PUBLIC_SEA}} options={commonScreenOptions} />
    <Stack.Screen name="ViewMerchant" component={ViewMerchant} options={commonScreenOptions} />
    <Stack.Screen name="MyMerchantDetail" component={MyMerchantDetail} options={commonScreenOptions} />
    <Stack.Screen name="ShopList" component={ShopList} options={commonScreenOptions} />
    <Stack.Screen name="ShopDetail" component={ShopDetail} options={commonScreenOptions} />
  </>
);

export default RouterMerchant;
