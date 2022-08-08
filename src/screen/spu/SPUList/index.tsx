import React from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import {NavigationBar} from '../../../component';

const SPUList: React.FC = () => {
  // const [loading, setLoading] = useState(false);
  // const navigation = useNavigation();
  return (
    <>
      <NavigationBar title="商品列表" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text>SPUList</Text>
        </View>
      </ScrollView>
    </>
  );
};
export default SPUList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6cf',
  },
});
