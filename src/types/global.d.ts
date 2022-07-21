import type {NativeStackScreenProps} from '@react-navigation/native-stack';

export {};

declare global {
  interface global {
    LANG: string;
  }
  type RootStackParamList = {
    Welcome: undefined;
  };

  type Props = NativeStackScreenProps<RootStackParamList>;
}
