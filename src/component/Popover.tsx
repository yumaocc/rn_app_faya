import React, {FC} from 'react';
import {Text} from 'react-native';
import {Popover} from '@ant-design/react-native';
import {Options} from '../models';

interface PopMenuProps {
  options: Options[];
  onChange: (value: any) => void;
  title?: React.ReactNode;
}

const PopMenu: FC<PopMenuProps> = props => {
  const {options, onChange, title} = props;
  return (
    <Popover
      overlay={
        <>
          {options.map(item => {
            <Popover.Item value={item?.value}>
              <Text>{item?.label}</Text>
            </Popover.Item>;
          })}
        </>
      }
      triggerStyle={{paddingVertical: 6}}
      onSelect={v => onChange(v)}>
      {title}
    </Popover>
  );
};

export default PopMenu;

PopMenu.defaultProps = {
  options: [],
  onChange: () => {},
};
