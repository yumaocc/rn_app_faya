import React from 'react';
import {FC} from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';

interface LoadingProps {
  active: boolean;
}
const Loading: FC<LoadingProps> = ({active}) => {
  return (
    active && (
      <View style={styles.container}>
        <ActivityIndicator animating={true} />
      </View>
    )
  );
};

export default Loading;

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: '50%',
    zIndex: 999,
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});
