import React from 'react';
import {commonScreenOptions, Stack} from './config';
import SPUEdit from '../screen/spu/SPUEdit';
import SPUList from '../screen/spu/SPUList';
const RouterSPU = (
  <>
    <Stack.Screen
      name="EditSPU"
      component={SPUEdit}
      options={{
        ...commonScreenOptions,
      }}
    />
    <Stack.Screen
      name="AddSPU"
      component={SPUEdit}
      options={{
        ...commonScreenOptions,
      }}
    />
    <Stack.Screen
      name="SPUList"
      component={SPUList}
      options={{
        ...commonScreenOptions,
      }}
    />
  </>
);

export default RouterSPU;
