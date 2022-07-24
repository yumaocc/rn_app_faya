import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {globalStyles} from '../../../constants/styles';
import {MerchantF, StylePropView} from '../../../models';

interface CardProps {
  merchant: MerchantF;
  style?: StylePropView;
}

const Card: React.FC<CardProps> = ({merchant, style}) => {
  return (
    <View style={[style, styles.container]}>
      <View style={[styles.header]}>
        <View style={[styles.logo]}>
          <Image
            source={{uri: 'https://fakeimg.pl/100'}}
            style={{width: 40, height: 40}}
          />
        </View>
        <View style={styles.headerRight}>
          <View>
            <View>
              <Text
                style={[globalStyles.textColorPrimary, styles.merchantName]}>
                {merchant.name}
              </Text>
              <Text>new</Text>
            </View>
            <View style={styles.tagWrapper}>
              <Text style={styles.tag}>待签约</Text>
            </View>
          </View>
          <View>
            <Text>{merchant.categoryName}</Text>
          </View>
        </View>
      </View>
      <View>
        <Text>商户模式</Text>
        <Text>单店</Text>
      </View>
    </View>
  );
};
export default Card;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  header: {
    flexDirection: 'row',
  },
  logo: {
    borderRadius: 5,
  },
  headerRight: {
    marginLeft: 10,
    flex: 1,
  },
  merchantName: {
    fontSize: 15,
    fontWeight: '500',
  },
  tagWrapper: {
    padding: 5,
    backgroundColor: '#FFB44333',
  },
  tag: {
    color: '#FFB443FF',
  },
});
