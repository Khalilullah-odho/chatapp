import {Dimensions, StyleSheet} from 'react-native';

const {width} = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  actionButton: {
    width: width - 30,
    alignSelf: 'center',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1976d2',
    borderRadius: 10,
    marginTop: 10,
  },

  actionButtonLabel: {
    color: '#fff',
    fontSize: 14,
  },

  extraButton: {
    marginTop: 20,
  },

  extraButtonLabel: {
    color: '#1976d2',
    fontSize: 14,
  },
});

export default styles;
