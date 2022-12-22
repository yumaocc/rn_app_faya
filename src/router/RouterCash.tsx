import React from 'react';
import {commonScreenOptions, Stack} from './config';
import Cash from '../screen/cash';
const RouterSPU = (
  <>
    <Stack.Screen name="Cash" component={Cash} options={commonScreenOptions} />
  </>
);

export default RouterSPU;
