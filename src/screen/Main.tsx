import React from 'react';
import Router from '../router/Router';
import {NavigationContainer} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/reducers';
import Loading from './common/Loading';

const Main: React.FC = () => {
  const isLoading = useSelector((state: RootState) => state.common.isLoading);
  if (isLoading) {
    return <Loading />;
  }
  return (
    <NavigationContainer>
      <Router />
    </NavigationContainer>
  );
};
export default Main;
