import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {Icon} from '@ant-design/react-native';
import {noop} from '../constants';
import {globalStyles, globalStyleVariables} from '../constants/styles';
import UnverifiedModal from './UnverifiedModal';
import {StylePropView, UserInfo, UserState} from '../models';
import {RootState} from '../redux/reducers';
import {useSelector} from 'react-redux';
import {useUserDispatcher} from '../helper/hooks';

interface PlusButtonProps {
  title: string;
  style?: StylePropView;
  onPress?: () => void;
  iconIsShow?: boolean;
  color?: string;
}

const PlusButton: React.FC<PlusButtonProps> = props => {
  const {title} = props;
  const [isShowModal, setIsShowModal] = useState(false);
  const userInfo = useSelector<RootState, UserInfo>(state => state.user.userInfo);
  const [userDispatcher] = useUserDispatcher();
  useEffect(() => {
    if (!userInfo) {
      userDispatcher.loadUserInfo();
    }
  }, [userDispatcher, userInfo]);

  const handleClick = () => {
    if (userInfo?.status === UserState.UN_CERTIFIED) {
      setIsShowModal(true);
      return;
    }
    props.onPress();
  };
  return (
    <TouchableOpacity onPress={handleClick} activeOpacity={0.6}>
      <View style={[styles.container, props.style]}>
        <Icon name="plus-circle" style={[globalStyles.primaryColor, styles.icon]} />
        <Text style={[styles.title, {color: globalStyleVariables.COLOR_PRIMARY}]}>{title}</Text>
      </View>
      <UnverifiedModal open={isShowModal} changeOpen={value => setIsShowModal(value)} />
    </TouchableOpacity>
  );
};
PlusButton.defaultProps = {
  onPress: noop,
  iconIsShow: true,
};
export default PlusButton;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 0,
  },
  icon: {
    fontSize: 18,
  },
  title: {
    paddingLeft: 5,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: 'bold',
  },
});
