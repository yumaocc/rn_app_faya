import React from 'react';
import {Text, View, ScrollView, StyleSheet} from 'react-native';
// import {SafeAreaView} from 'react-native-safe-area-context';
import {Header} from '@react-navigation/elements';
// import {useUserDispatcher} from '../../../helper/hooks';
import {Icon} from '@ant-design/react-native';
import {PlusButton, UnitNumber} from '../../component';
import {globalStyles, globalStyleVariables} from '../../constants/styles';
import {useHomeSummary} from '../../helper/hooks';
import {useNavigation} from '@react-navigation/native';
import {FakeNavigation} from '../../models';
import {TouchableOpacity} from 'react-native-gesture-handler';

const Home: React.FC = () => {
  const [summary] = useHomeSummary();
  const navigation = useNavigation() as FakeNavigation;
  return (
    <>
      <Header title="首页" headerLeft={() => <Icon name="bell" />} headerLeftContainerStyle={{paddingLeft: 16}} />
      <ScrollView style={{backgroundColor: globalStyleVariables.COLOR_PAGE_BACKGROUND}} contentContainerStyle={{padding: 16}}>
        {/* 今日收益 */}
        <View style={styles.cardContainer}>
          <View style={styles.cardTitleContainer}>
            <Text style={[globalStyles.textColorPrimary, styles.cardTitle]}>今日收益</Text>
            <Icon name="right" style={globalStyles.iconRight} />
          </View>
          <UnitNumber style={{paddingTop: 10}} type="money" value="----" />
        </View>

        <View style={[globalStyles.flexNormal, globalStyles.moduleMarginTop]}>
          {/* 我的商品 */}
          <View style={[styles.cardContainer, {flex: 1}]}>
            <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.navigate('SPUList')}>
              <View>
                <View style={styles.cardTitleContainer}>
                  <Text style={[globalStyles.textColorPrimary, styles.cardTitle]}>我的商品</Text>
                  <Icon name="right" style={globalStyles.iconRight} />
                </View>
                <UnitNumber style={{paddingTop: 10}} value={summary?.muSpus || 0} unit="件" />
              </View>
            </TouchableOpacity>
            <View style={[globalStyles.lineHorizontal, {marginVertical: 10}]} />
            <PlusButton
              title="新增商品"
              onPress={() => {
                navigation.navigate('AddSPU');
              }}
            />
          </View>
          {/* 我的合同 */}
          <View style={[globalStyles.moduleMarginLeft, styles.cardContainer, {flex: 1}]}>
            <View style={styles.cardTitleContainer}>
              <Text style={[globalStyles.textColorPrimary, styles.cardTitle]}>我的合同</Text>
              <Icon name="right" style={globalStyles.iconRight} />
            </View>
            <UnitNumber style={{paddingTop: 10}} value="---" unit="份" />
            <View style={[globalStyles.lineHorizontal, {marginVertical: 10}]} />
            <PlusButton
              title="新增合同"
              onPress={() => {
                navigation.navigate('AddContract');
              }}
            />
          </View>
        </View>
        {/* 商家 */}
        <View style={[globalStyles.moduleMarginTop, styles.cardContainer]}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{flex: 1, paddingRight: 10}}>
              <View style={styles.cardTitleContainer}>
                <Text style={[globalStyles.textColorPrimary, styles.cardTitle]}>我的私海</Text>
                <Icon name="right" style={globalStyles.iconRight} />
              </View>
              <UnitNumber style={{paddingTop: 10}} value={summary?.privateSeaNums || 0} unit={`/${summary?.privateSeaLimit || 0}`} />
            </View>
            <View style={[globalStyles.lineVertical, {marginHorizontal: 5, height: 29}]} />
            <View style={{flex: 1, paddingLeft: 10}}>
              <View style={styles.cardTitleContainer}>
                <Text style={[globalStyles.textColorPrimary, styles.cardTitle]}>我的商家</Text>
                <Icon name="right" style={globalStyles.iconRight} />
              </View>
              <UnitNumber style={{paddingTop: 10}} value={summary?.myBizUsers || 0} unit="家" />
            </View>
          </View>
          <View style={[globalStyles.lineHorizontal, {marginVertical: 10}]} />
          <PlusButton
            style={{justifyContent: 'center'}}
            title="新增私海商家"
            onPress={() => {
              console.log('on press');
            }}
          />
        </View>
      </ScrollView>
    </>
  );
};
export default Home;

export const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 5,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 16,
  },
  cardTitleContainer: {
    // borderColor: '#ccc',
    // borderWidth: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 15,
  },
  cardIcon: {
    fontSize: 15,
  },
});
