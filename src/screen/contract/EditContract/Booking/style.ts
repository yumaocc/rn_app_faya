import {StyleSheet} from 'react-native';
import {globalStyleVariables} from '../../../../constants/styles';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionGroupStyle: {
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    paddingTop: 13,
  },
  button: {
    marginTop: globalStyleVariables.MODULE_SPACE,
    paddingHorizontal: globalStyleVariables.MODULE_SPACE,
  },
  shopList: {
    backgroundColor: '#f7f7f7',
    paddingHorizontal: 15,
  },
  shopItem: {
    paddingVertical: 8,
    alignContent: 'center',
  },
  buyNoticeTemplate: {
    padding: 15,
    borderRadius: 5,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: globalStyleVariables.BORDER_COLOR,
  },
  templateText: {
    fontSize: 15,
  },
  modelCard: {
    borderWidth: 1,
  },
  composeItemWrapper: {
    paddingHorizontal: 10,
    backgroundColor: '#f7f7f7',
    borderRadius: 5,
  },
  composeItem: {
    backgroundColor: '#f7f7f7',
  },
  sectionGroup: {
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    paddingTop: 13,
  },
});
