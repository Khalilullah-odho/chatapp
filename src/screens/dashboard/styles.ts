import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },

  contentContainer: {flexGrow: 1, padding: 10},

  chatProfile: {
    width: '100%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#64748B',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 20,
    marginTop: 10,
  },

  chatProfileUserName: {color: 'black', fontSize: 14, fontWeight: 'bold'},
  chatProfileLastMsg: {color: '#7A8D9C', fontSize: 13},

  msgDate: {
    marginHorizontal: 10,
    marginBottom: 5,
    fontSize: 10,
  },

  msgDay: {color: 'gray', textAlign: 'center'},
  chatInput: {
    width: '100%',
    backgroundColor: '#CBD5E1',
    height: 100,
  },

  logoutText: {color: 'black'},
});

export default styles;
