import {
  StyleSheet,
  StatusBar
} from 'react-native';

export default StyleSheet.create({
  profileContainer: {
    flex: 1,
    flexDirection: 'column',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: StatusBar.currentHeight,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: 'white',
    // borderColor: 'yellow',
    // borderWidth: 3
  },
  headerContainer: {
    width: '100%',
    height: 60,
    marginTop: 20,
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    // borderColor: 'red',
    // borderWidth: 3
  },
})