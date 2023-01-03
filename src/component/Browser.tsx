import React from 'react';
import {View, StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';
import {useParams} from '../helper/hooks';
import NavigationBar from './NavigationBar';
// import MyStatusBar from '../../component/MyStatusBar';

const Browser: React.FC = () => {
  const {url} = useParams<{url: string}>();
  const [title, setTitle] = React.useState('');
  return (
    <View style={styles.container}>
      <NavigationBar title={title} />
      <WebView
        source={{uri: url}}
        style={{flex: 1}}
        onLoad={e => {
          setTitle(e.nativeEvent.title);
        }}
      />
    </View>
  );
};

export default Browser;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
