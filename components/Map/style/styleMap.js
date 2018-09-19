import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    backgroundColorLightBlue: {
      backgroundColor: '#2b2929',
      
    },
    colorOrange: {
      color: '#faa71a'
    },
    finishTrip: {
      backgroundColor: 'white', 
      position: 'absolute', 
      flex: 1, 
      top: '80%', 
      width: '110%', 
      height: '25%', 
      padding: 15, 
      alignItems: 'center', 
      justifyContent: 'center'
    },
    cancelTripWithoutDr: {
      backgroundColor: '#2b2929', 
      height: 50, 
      width: 180, 
      justifyContent: 'center', 
      alignItems: 'center', 
      borderRadius: 15, 
      marginTop: 25
    },
    cancelTripdriver: {
      position: 'absolute', 
      marginTop: '20%', 
      right: -85
    },
    finishTripdriver: {
      marginLeft: -200, 
      marginTop: -25
    },
    finishTripButton: {
      backgroundColor: '#2b2929', 
      height: 50, 
      width: '50%', 
      justifyContent: 'center', 
      alignItems: 'center', 
      borderRadius: 15
    },
    contentMessageTrip: {
      backgroundColor: 'white', 
      position: 'absolute', 
      flex: 1, 
      top: '70%', 
      width: '110%', 
      height: '35%', 
      padding: 15, 
      alignItems: 'center'
    },
    sentMessageAdmin: {
      width: '100%', 
      padding: 15, 
      alignItems: 'center', 
      top: '10%'
    },
    imageCar: {
      height: 100, 
      width: 100
    },
    submitTrip: {
      backgroundColor: '#2b2929', 
      height: 50, 
      width: '45%', 
      justifyContent: 'center', 
      alignItems: 'center', 
      position: 'absolute', 
      borderRadius: 15, 
      left: 15, 
      top: '75%'
    },
    cancelTrip: {
      backgroundColor: '#2b2929', 
      height: 50, 
      width: '45%', 
      justifyContent: 'center', 
      alignItems: 'center', 
      position: 'absolute', 
      borderRadius: 15, 
      right: 15, 
      top: '75%'
    },
    findTrip: {
      backgroundColor: '#2b2929', 
      width: 100, 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: 50, 
      borderBottomRightRadius: 15, 
      borderTopRightRadius: 15,
      position: 'absolute',
      marginLeft: 140
    },
    container: {
      flex: 1,
      alignItems: 'center',
      padding: 15,
      width: '100%'
    },
    colorWhite: {
      color: 'white'
    },
    alignItems: {
      alignItems: 'center'
    },
    textAreaContainer: {
      marginTop: 15
    },
    textArea: {
      backgroundColor: 'rgba(225,225,225,0.2)',
      height: 150,
      justifyContent: "flex-start",
      padding: 15,
      color: 'white'
    },
    containerTouchableOpacity: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    },
    containerModalWindow: {
      width: '100%',
      backgroundColor: 'white',
      height: '65%',
      padding: 15,
      overflow: 'scroll',
      borderRadius: 15,
    },
    containerModalWindowCancelTrip: {
      backgroundColor: '#2b2929',
      width: '100%',
      height: '65%',
      padding: 15,
      overflow: 'scroll',
      borderRadius: 15,
    },
    backgroundColorOrange: {
      backgroundColor: '#474747'
    },
    widthMap: {
      position: 'absolute',
      height: '60%'
    },
    map: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    inputWrapper: {
      flex: 1,
      backgroundColor: 'transparent',
      position: 'absolute', 
      top: 50,
    },
  inputSearch: {
      backgroundColor: 'rgba(0,0,0,0.4)',
      color: 'white',
      width: 250,
      height: 50,
      padding: 15,
      borderRadius: 15,
      marginLeft: -100
  }
});
export default styles;