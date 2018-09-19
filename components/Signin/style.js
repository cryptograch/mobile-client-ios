import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      padding: 15,
      width: '100%'
    },
    imgPassword: {
      position: 'absolute', 
      height: 35, 
      width: 35, 
      left: 2
    },
    textColor: {
      color: 'red'
    },
    marginTopError: {
      marginTop: -50
    },
    alignCenter: {
      alignItems: 'center'
    },
    emailError: {
      borderColor: 'red',
      borderWidth: 2
    },
    imgAccount: {
      position: 'absolute', 
      height: 40, 
      width: 40
    },
    email: {
      width: 300,
      height: 40,
      backgroundColor: 'rgba(255,255,255,0.9)',
      borderRadius: 15,
      paddingLeft: 40,
    },
    ImageStyle: {
      padding: 10,
      margin: 5,
      height: 25,
      width: 25,
      resizeMode : 'stretch',
      alignItems: 'center'
    },
    signin: {
      top: '15%'
    },
    welcome: {
      fontSize: 20,
      textAlign: 'center',
      margin: 5,
      color: 'white'
    },
    instructions: {
      textAlign: 'center',
      color: '#333333',
      marginBottom: 5,
    },
    HomeImg: {
      marginTop: '10%',
      width: '100%',
      height: '40%'
    },
    marginTop: {
      marginTop: '10%'
    },
    top: {
      marginTop: '5%'
    },
    Right: {
      top: '70%',
      right: '2%',
      
    },
    Left: {
      top: '70%',
      left: '2%'
    },
    linkApp: {
      top: '20%',
      width: 300,
      borderRadius: 15,
      alignItems: 'center',
      backgroundColor: '#2b2929',
      height: 40,
      justifyContent: 'center',
    },
    app: {
      color: '#faa71a',
      fontSize: 20
    },
    logo: {
      height:200,
      width: 200,
      borderRadius: 50
    },
    loginContainer: {
      justifyContent: 'center',
      height:100,

    }
  });
  export default styles;