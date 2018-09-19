import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 15
    },
    height: {
      height: '60%'
    },
    messageStyle: {
      width: '100%', 
      height: 50, 
      marginTop: 5, 
      backgroundColor: 'white', 
      justifyContent: 'center', 
      alignItems: 'center'
    },
    styleMessageWithout: {
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100%'
    },
    styleTextMessage: {
      color: 'red', 
      fontSize: 25
    },
    messagesContent: {
      height: 100, 
      width: '100%', 
      marginTop: 15, 
      justifyContent: 'center', 
      alignItems: 'center', 
      borderRadius: 15, 
      backgroundColor: 'white'
    },
    writeOnEmail: {
      marginTop: 15, 
      fontWeight: 'bold'
    }

});

export default styles;
