import type {NativeStackScreenProps} from '@react-navigation/native-stack';

export {};

declare global {
  interface global {
    LANG: string;
  }
  type RootStackParamList = {
    Home: undefined;
    Redux: undefined;
    Map: undefined;
    Network: undefined;
    Share: undefined;
    Push: undefined;
  };

  type Props = NativeStackScreenProps<RootStackParamList>;
}
