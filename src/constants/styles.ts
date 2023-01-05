import {StyleSheet} from 'react-native';

export const globalStyleVariables = {
  COLOR_PRIMARY: '#546DAD',
  COLOR_WARNING: '#FFC107',
  COLOR_DANGER: '#F44336',
  COLOR_ERROR: '#FF6060',
  TEXT_COLOR_PRIMARY: '#333',
  TEXT_COLOR_SECONDARY: '#666',
  TEXT_COLOR_TERTIARY: '#999',
  BORDER_COLOR: '#0000001A',
  MODULE_SPACE: 10,
  COLOR_PAGE_BACKGROUND: '#f4f4f4',
};

export const globalStyles = StyleSheet.create({
  error: {
    color: '#FF6060', //表单错误的提示信息
    fontSize: 12,
    fontWeight: '500',
  },
  containerForTmp: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerLR: {
    // 左右结构容器
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  containerCenter: {
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
  fontPrimary: {
    // 主要字体样式
    color: globalStyleVariables.TEXT_COLOR_PRIMARY,
    fontSize: 15,
    fontWeight: '500',
  },
  fontSecondary: {
    // 次要字体样式
    color: globalStyleVariables.TEXT_COLOR_SECONDARY,
    fontSize: 15,
    fontWeight: '500',
  },
  fontTertiary: {
    // 辅助字体样式
    color: globalStyleVariables.TEXT_COLOR_TERTIARY,
    fontSize: 12,
    fontWeight: '500',
  },
  primaryColor: {
    color: globalStyleVariables.COLOR_PRIMARY,
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
    backgroundColor: globalStyleVariables.BORDER_COLOR,
  },
  lineVertical: {
    width: 1,
    backgroundColor: globalStyleVariables.BORDER_COLOR,
  },
  borderTop: {
    borderTopWidth: 0.3,
    borderTopColor: globalStyleVariables.BORDER_COLOR,
  },
  borderBottom: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: globalStyleVariables.BORDER_COLOR,
  },
  tagWrapper: {
    padding: 5,
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 180, 67, 0.2)',
    alignSelf: 'flex-start',
    alignItems: 'center',
    borderRadius: 3,
  },
  tag: {
    fontSize: 12,
    color: '#FFB443',
  },
  dropDownItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 5,
    borderWidth: 0,
    shadowColor: 'rgba(0, 0, 0, 0.2)', //设置阴影色
    shadowOffset: {width: 0, height: 0}, //设置阴影偏移,该值会设置整个阴影的偏移，width可以看做x,height可以看做y,x向右为正，y向下为正
    shadowOpacity: 1,
    shadowRadius: 1,
    width: 100,
  },
  //下拉菜单专用
  dropDownText: {
    width: '100%',
    height: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  fontSize12: {
    fontSize: 12,
  },
  tagWrapperGreen: {
    padding: 5,
    backgroundColor: 'rgba(74, 184, 125, 0.2)',
  },
  tagGreen: {
    color: '#4AB87D',
    fontSize: 10,
  },
  wrapper: {
    flex: 1,
  },
  //分割线
  dividingLine: {
    width: 1,
    height: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    marginLeft: globalStyleVariables.MODULE_SPACE,
    marginRight: globalStyleVariables.MODULE_SPACE,
  },
  inputWidth: {
    width: 70,
  },
  //左右边距
  marginRightLeft: {
    marginLeft: globalStyleVariables.MODULE_SPACE,
    marginRight: globalStyleVariables.MODULE_SPACE,
  },
});

export const FontSize = StyleSheet.create({
  f15: {
    fontSize: 15,
  },
});
