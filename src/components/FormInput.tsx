import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import React from 'react';

const {width} = Dimensions.get('window');

interface Props extends TextInputProps {
  label: string;
  isError?: boolean;
}

const FormInput = React.memo((props: Props) => {
  const {onChangeText, value, isError = false, label, placeholder} = props;
  return (
    <View style={styles.inputContainer}>
      <Text allowFontScaling={false} style={styles.textInputLabel}>
        {label}
      </Text>
      <TextInput
        style={[styles.textInput, isError && styles.textInputError]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={'gray'}
        secureTextEntry={props.secureTextEntry}
      />
    </View>
  );
});

export {FormInput};

const styles = StyleSheet.create({
  inputContainer: {
    width: width - 30,
    marginVertical: 10,
  },

  textInput: {
    width: '100%',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    height: 50,
    borderRadius: 10,
    marginTop: 5,
    paddingHorizontal: 10,
    color: 'black',
  },

  textInputError: {
    borderColor: 'red',
  },

  textInputLabel: {
    color: 'black',
    fontSize: 14,
    paddingLeft: 4,
  },
});
