import {StyleSheet} from 'react-native';
import React, {PropsWithChildren} from 'react';
import {
  SafeAreaView as SafeArea,
  SafeAreaViewProps,
} from 'react-native-safe-area-context';

interface Props extends PropsWithChildren {
  edges?: SafeAreaViewProps['edges'];
}

const SafeAreaView: React.FC<Props> = props => {
  return (
    <SafeArea edges={props.edges} style={styles.container}>
      {props.children}
    </SafeArea>
  );
};

export {SafeAreaView};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
