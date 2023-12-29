import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {SafeAreaView} from '../../components';
import styles from './styles';
import firestore from '@react-native-firebase/firestore';
import {storage} from '../../../App';
import {User} from '../../utils/interfaces';
import {NavigationProp, useNavigation} from '@react-navigation/native';

const Dashboard = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [users, setUsers] = useState<User[]>([]);
  let currentUser = JSON.parse(storage.getString('user') ?? '{}');

  useLayoutEffect(() => {
    navigation.setOptions({
      // eslint-disable-next-line react/no-unstable-nested-components
      headerRight: () => (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            storage.delete('user');
            navigation.reset({
              index: 0,
              routes: [{name: 'Login'}],
            });
          }}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('users')
      .where('email', '!=', currentUser?.email)
      .onSnapshot(snapshot => {
        if (!snapshot.empty) {
          const usersData: any = snapshot.docs.map(doc => doc.data());
          setUsers(usersData);
        }
      });

    return () => unsubscribe();
  }, [currentUser?.email]);

  const renderItem = React.useCallback(
    ({item}: {item: User}) => {
      return (
        <TouchableOpacity
          style={styles.chatProfile}
          onPress={() => {
            navigation.navigate('ChatScreen', {chatUser: item});
          }}
          activeOpacity={0.8}>
          <Text style={styles.chatProfileUserName}>{item.name}</Text>
          <Text style={styles.chatProfileLastMsg}>{item.lastMsg}</Text>
        </TouchableOpacity>
      );
    },
    [navigation],
  );

  return (
    <SafeAreaView edges={['bottom', 'left', 'right']}>
      <View style={styles.container}>
        <FlatList
          data={users}
          renderItem={renderItem}
          keyExtractor={(__, index) => index.toString()}
          extraData={users}
          contentContainerStyle={styles.contentContainer}
        />
      </View>
    </SafeAreaView>
  );
};

export default Dashboard;
