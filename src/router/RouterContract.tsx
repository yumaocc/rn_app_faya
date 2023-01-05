import React from 'react';
import {commonScreenOptions, Stack} from './config';
import ContractList from '../screen/contract/ContractList';
import EditContract from '../screen/contract/EditContract';
import ViewContract from '../screen/contract/EditContract/ViewContract';

const RouteContract = (
  <>
    <Stack.Screen name="ContractList" component={ContractList} options={commonScreenOptions} />
    <Stack.Screen name="EditContract" component={EditContract} options={commonScreenOptions} />
    <Stack.Screen name="AddContract" component={EditContract} options={commonScreenOptions} />
    <Stack.Screen name="ViewContract" component={ViewContract} options={commonScreenOptions} />
  </>
);

export default RouteContract;
