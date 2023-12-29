import {View, Text, ViewStyle} from 'react-native';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {storage} from '../../../App';
import firestore from '@react-native-firebase/firestore';

import {GiftedChat, IMessage} from 'react-native-gifted-chat';
import styles from './styles';
import {SafeAreaView} from '../../components';
import moment from 'moment';

const ChatScreen = () => {
  const {params} = useRoute<RouteProp<any>>();
  const navigation = useNavigation<NavigationProp<any>>();
  let currentUser = JSON.parse(storage.getString('user') ?? '{}');
  const [messages, setMessages] = useState([]);
  const [_newMessage, setNewMessage] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({
      title: params?.chatUser?.name,
    });
  }, [navigation, params?.chatUser?.name]);

  useEffect(() => {
    const chatId = generateChatId(currentUser.userId, params?.chatUser?.userId);

    const unsubscribe = firestore()
      .collection('conversations')
      .doc(chatId)
      .collection('messages')
      .orderBy('timestamp', 'desc')
      .onSnapshot(snapshot => {
        const messagesData: any = snapshot.docs.map(doc => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        });
        setMessages(messagesData);
      });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateChatId = (id1: string, id2: string) => {
    return [id1, id2].sort().join('');
  };

  const onSend = React.useCallback(
    async (msgs: IMessage[]) => {
      if (msgs[0].text === '') {
        return;
      }
      try {
        const chatId = generateChatId(
          currentUser?.userId,
          params?.chatUser?.userId,
        );

        const messageData = {
          ...msgs[0],
          senderId: currentUser?.userId,
          recieverId: params?.chatUser?.userId,
          timestamp: firestore.FieldValue.serverTimestamp(),
          createdAt: firestore.FieldValue.serverTimestamp(),
        };

        await firestore()
          .collection('conversations')
          .doc(chatId)
          .collection('messages')
          .add(messageData);

        const batch = firestore().batch();
        const currentUserProfileRef = firestore()
          .collection('users')
          .doc(currentUser?.userId);

        batch.update(currentUserProfileRef, {lastMsg: msgs[0].text});

        const otherUserProfileRef = firestore()
          .collection('users')
          .doc(params?.chatUser?.userId);
        batch.update(otherUserProfileRef, {lastMsg: msgs[0].text});

        await batch.commit();
        setNewMessage('');
      } catch (error) {}
    },
    [currentUser?.userId, params?.chatUser?.userId],
  );

  return (
    <SafeAreaView edges={['bottom', 'left', 'right']}>
      <View style={styles.container}>
        <GiftedChat
          messages={messages}
          onSend={msgs => onSend(msgs)}
          user={{
            _id: currentUser?.userId,
            name: currentUser?.name,
          }}
          renderDay={props => {
            const {currentMessage, previousMessage} = props;
            let currentCreatedAt = currentMessage?.createdAt as any;
            let previousCreatedAt = previousMessage?.createdAt as any;
            currentCreatedAt = moment(currentCreatedAt?.toDate());
            previousCreatedAt = moment(previousCreatedAt?.toDate());

            if (
              !previousMessage ||
              !moment(currentCreatedAt).isSame(previousCreatedAt, 'day')
            ) {
              return (
                <View style={props.containerStyle}>
                  <Text style={styles.msgDay}>
                    {moment(currentCreatedAt).format('MMMM D, YYYY')}
                  </Text>
                </View>
              );
            }

            return null;
          }}
          renderTime={timeProps => {
            const {currentMessage, position, containerStyle} = timeProps;
            const color = position === 'left' ? 'gray' : 'white';
            const createdAt = currentMessage?.createdAt as any;
            return (
              <View style={containerStyle as ViewStyle}>
                <Text style={[styles.msgDate, {color}]}>
                  {`${moment(createdAt?.toDate()).format('hh:mm A')}`}
                </Text>
              </View>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default ChatScreen;
