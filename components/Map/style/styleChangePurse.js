import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
      },
      widthQrScanner: {
        width: '100%',
        marginTop: 50,
        height: 250
      },
      colorBlack: {
        color: 'black', 
        fontSize: 15
      },
      tryAgain: {
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: 10, 
        marginTop: 5, 
        borderColor: 'white', 
        borderWidth: 1
      },
      saveChanges: {
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: 10, 
        marginTop: 5, 
        backgroundColor: '#faa71a'
      },
      newTryAgain: {
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: 10, 
        marginTop: 5,
      },
      containerWhite: {
          backgroundColor: 'white', 
          padding: 15, 
          width: '100%', 
          borderRadius: 15
      },
      paddingCont: {
          padding: 15, 
          width: '100%', 
          marginTop: 50
      },
      width: {
          width: '100%',
          height: '100%'
      },
      containerBlack: {
          backgroundColor: '#2b2929', 
          width: '100%', 
          height: 150, 
          alignItems: 'center'
      },
      containerLogo: {
        textAlign: 'center',
        width: 250,
        height: 100,
        top: 25
      },
      marginTop: {
          marginTop: -50
      },
      backgroundColor: {
        backgroundColor: '#faa71a'
      }
  });

export default styles;