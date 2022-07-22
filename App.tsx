import React from 'react';
import Main from './src/screen/Main';
import {Provider as AntProvider} from '@ant-design/react-native';
import zhCN from '@ant-design/react-native/lib/locale-provider/zh_CN';
import theme from './src/constants/theme';
import GlobalToast from './src/component/GlobalToast';
import {Provider} from 'react-redux';

import store from './src/redux/store';

const App = () => {
  return (
    <AntProvider locale={zhCN} theme={theme}>
      <Provider store={store}>
        <Main />
        <GlobalToast />
      </Provider>
    </AntProvider>
  );
};

export default App;
