import {
    StyleSheet, 
  } from 'react-native';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
    },
    Signin: {
      color: '#faa71a', 
      top: 0, 
      marginLeft: 15
    },
    containerRegistration: {
      marginTop: -20, 
      height: "106%"
    },
    createAccount: {
      color: '#faa71a', 
      top: -60, 
      marginLeft: 30
    },
    forgotPass: {
      color: '#faa71a', 
      top: 395, 
      marginLeft: 215, 
      position: 'absolute'
    },
    containerTouchableOpacity: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    },
    containerModalWindow: {
      width: 300,
      backgroundColor: 'white',
      height: 350,
      padding: 15,
      alignItems: 'center',
      borderRadius: 15
    },
    backgroundColorLightBlue: {
      backgroundColor: '#2980b6',
      
    },
    marginTop: {
      marginTop: '25%'
    },
    video: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    },
    linkApp: {
      top: 0,
    },
    logo: {
      height:128,
      width: 128,
      borderRadius: 64
    },
    app: {
      color: '#faa71a',
      fontSize: 20
    },
  });
  export default styles;