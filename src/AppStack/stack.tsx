// In App.js in a new project

import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../screens/auth/login';
import SignUp from '../screens/auth/signup';
import Dashboard from '../screens/dashboard/dashboard';
import {storage} from '../../App';
import ChatScreen from '../screens/dashboard/chatScreen';

const Stack = createNativeStackNavigator();

function AppStack() {
  const currentUser = storage.getString('user');
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName={currentUser ? 'Dashboard' : 'Login'}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen
          name="Dashboard"
          component={Dashboard}
          options={{headerShown: true, title: 'Chats'}}
        />
        <Stack.Screen
          name="ChatScreen"
          component={ChatScreen}
          options={{headerShown: true}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppStack;
