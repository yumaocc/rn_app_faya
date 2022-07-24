import {StyleSheet} from 'react-native';

export const globalStyles = StyleSheet.create({
  containerForTmp: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flexCenter: {
    alignContent: 'center',
    justifyContent: 'center',
  },
  width100: {
    width: '100%',
  },
  primaryColor: {
    color: '#546DAD',
  },
  primaryBGColor: {
    backgroundColor: '#546DAD',
  },
  moduleMarginTop: {
    // 模块上间距
    marginTop: 10,
  },
  moduleMarginLeft: {
    // 模块左间距
    marginLeft: 10,
  },
  moduleSpaceWidth: {
    // 模块间距
    width: 10,
  },
  moduleSpaceHeight: {
    // 模块间距
    height: 10,
  },
  flexNormal: {
    flexDirection: 'row',
  },
  textColorPrimary: {
    color: '#333',
  },
  textColorSecondary: {
    color: '#999',
  },
  // icon
  iconRight: {
    fontSize: 15,
    color: '#999',
  },
  lineHorizontal: {
    height: 1,
    backgroundColor: '#0000001A', // 透明度为0.1的黑色
  },
  lineVertical: {
    width: 1,
    backgroundColor: '#0000001A',
  },
});
