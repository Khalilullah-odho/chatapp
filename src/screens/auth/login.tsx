import {LayoutAnimation, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import styles from './styles';
import {FormInput, SafeAreaView} from '../../components';
import {
  NavigationProp,
  StackActions,
  useNavigation,
} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Toast from 'react-native-simple-toast';
import {storage} from '../../../App';

const Login = () => {
  const navigation = useNavigation<NavigationProp<any>>(); // giving type as any right now but you can create its custom type of stackparamlist;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);

  const animateHOFunc = (callback: () => void) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    return callback();
  };

  const onLogin = async () => {
    if ([email, password].includes('')) {
      Toast.show('All fields are required!', Toast.SHORT);
      return;
    }
    try {
      const response = await auth().signInWithEmailAndPassword(email, password);

      const snapshot = await firestore()
        .collection('users')
        .doc(response.user.uid)
        .get();

      if (snapshot.exists) {
        storage.set('user', JSON.stringify(snapshot.data()));
        navigation.dispatch(StackActions.replace('Dashboard'));
      } else {
        Toast.show('User not found!', Toast.SHORT);
      }
    } catch (error: any) {
      Toast.show(error?.message?.split(']')[1] || 'Server Error!', Toast.SHORT);
    }
  };

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
      animateHOFunc(() => {
        setIsSignup(false);
        setEmail('');
        setPassword('');
        setName('');
      });
    } catch (error: any) {
      Toast.show(error?.message?.split(']')[1] || 'Server Error!', Toast.SHORT);
    }
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        {isSignup && (
          <FormInput
            label="Name"
            value={name}
            onChangeText={text => setName(text)}
            placeholder="enter your full name"
          />
        )}
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
          onPress={isSignup ? onSignUp : onLogin}
          style={styles.actionButton}
          activeOpacity={0.8}>
          <Text allowFontScaling={false} style={styles.actionButtonLabel}>
            {isSignup ? 'Signup' : 'Login'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            animateHOFunc(() => {
              setIsSignup(!isSignup);
            });
          }}
          style={styles.extraButton}
          activeOpacity={0.8}>
          <Text allowFontScaling={false} style={styles.extraButtonLabel}>
            {isSignup ? 'Login Now...' : 'Create an account...'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Login;
