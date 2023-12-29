import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AppStack from './src/AppStack/stack';
import {Platform, StatusBar, UIManager} from 'react-native';
import {MMKV} from 'react-native-mmkv';

export const storage = new MMKV();
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}
const App = (props: any) => {
  return (
    <SafeAreaProvider>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <AppStack {...props} />
    </SafeAreaProvider>
  );
};

export default App;
