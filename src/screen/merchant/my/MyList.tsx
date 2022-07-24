import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const MyList: React.FC = () => {
  return (
    <View>
      <View style={styles.header}>
        <Text>共{25}家</Text>
      </View>
    </View>
  );
};
export default MyList;

const styles = StyleSheet.create({
  header: {
    height: 45,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
});
