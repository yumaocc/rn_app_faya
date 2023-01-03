import React, {useState} from 'react';
import {WebView} from 'react-native-webview';
import {NavigationBar} from '../../component';
import Loading from '../../component/Loading';
const Agreement = () => {
  const [loading, setLoading] = useState(true);
  return (
    <>
      <NavigationBar title="协议" />
      <Loading active={loading} />
      <WebView onLoad={() => setLoading(false)} source={{uri: 'https://faya-manually-file.faya.life/protocol/faya-user-bd.html'}} style={{marginTop: 20}} />
    </>
  );
};

export default Agreement;
