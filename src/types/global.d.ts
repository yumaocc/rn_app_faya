import type {NativeStackScreenProps} from '@react-navigation/native-stack';

export {};

declare global {
  interface global {
    LANG: string;
  }
  type RootStackParamList = {
    Welcome: undefined;
  };

  type Environment = 'development' | 'production';

  // 后端经常用0和1代表bool
  type BoolNumber = 0 | 1;

  // 形如2020-01-01 00:00:00的时间格式
  type DateTimeString = string;

  // 形如2020-01-01的日期格式
  type DateString = string;

  type Props = NativeStackScreenProps<RootStackParamList>;
}
