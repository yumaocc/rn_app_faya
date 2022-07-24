import {StyleSheet} from 'react-native';

export const globalStyleVariables = {
  COLOR_PRIMARY: '#546DAD',
  TEXT_COLOR_PRIMARY: '#333',
  TEXT_COLOR_SECONDARY: '#999',
  MODULE_SPACE: 10,
};

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
    backgroundColor: globalStyleVariables.COLOR_PRIMARY,
  },
  moduleMarginTop: {
    // 模块上间距
    marginTop: globalStyleVariables.MODULE_SPACE,
  },
  moduleMarginLeft: {
    // 模块左间距
    marginLeft: globalStyleVariables.MODULE_SPACE,
  },
  moduleSpaceWidth: {
    // 模块间距
    width: globalStyleVariables.MODULE_SPACE,
  },
  moduleSpaceHeight: {
    // 模块间距
    height: globalStyleVariables.MODULE_SPACE,
  },
  flexNormal: {
    flexDirection: 'row',
  },
  textColorPrimary: {
    color: globalStyleVariables.TEXT_COLOR_PRIMARY,
  },
  textColorSecondary: {
    color: globalStyleVariables.TEXT_COLOR_SECONDARY,
  },
  // icon
  iconRight: {
    fontSize: 15,
    color: globalStyleVariables.TEXT_COLOR_SECONDARY,
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
