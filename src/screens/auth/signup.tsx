import {Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import styles from './styles';
import {FormInput, SafeAreaView} from '../../components';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Toast from 'react-native-simple-toast';

const SignUp = () => {
  const navigation = useNavigation<NavigationProp<any>>(); // giving type as any right now but you can create its custom type of stackparamlist;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const onSignUp = async () => {
    if ([email, password, name].includes('')) {
      Toast.show('All fields are required!', Toast.SHORT);
      return;
    }
    try {
      const {user} = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );

      await firestore().collection('users').doc(user.uid).set({
        name,
        email,
        userId: user.uid,
      });

      navigation.goBack();
    } catch (error: any) {
      Toast.show(error?.message?.split(']')[1] || 'Server Error!', Toast.SHORT);
    }
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <FormInput
          label="Name"
          value={name}
          onChangeText={text => setName(text)}
          placeholder="enter your full name"
        />
        <FormInput
          label="Email"
          value={email}
          onChangeText={text => setEmail(text)}
          placeholder="enter your email address"
          keyboardType="email-address"
        />

        <FormInput
          label="Password"
          value={password}
          onChangeText={text => setPassword(text)}
          secureTextEntry={true}
          placeholder="********"
        />

        <TouchableOpacity
          onPress={onSignUp}
          style={styles.actionButton}
          activeOpacity={0.8}>
          <Text allowFontScaling={false} style={styles.actionButtonLabel}>
            Sign Up
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.extraButton}
          activeOpacity={0.8}>
          <Text allowFontScaling={false} style={styles.extraButtonLabel}>
            Login Now...
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SignUp;
