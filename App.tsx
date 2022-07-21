import React from 'react';
import Navigator from './src/component/Navigator';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';

import store from './src/redux/store';

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Navigator />
      </NavigationContainer>
    </Provider>
  );
};

export default App;
