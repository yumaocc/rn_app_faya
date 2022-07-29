import {StyleSheet} from 'react-native';
import {globalStyleVariables} from '../../constants/styles';

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
});
