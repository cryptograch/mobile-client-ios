import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        
      },
      containerLogo: {
        textAlign: 'center',
        width: 250,
        height: 100,
        top: 25
      },
      containerHeader: {backgroundColor: '#2b2929', width: '100%', height: 150, alignItems: 'center'},
      containerForm: {marginTop: 15, backgroundColor: 'white', margin: 15, borderRadius: 15, padding: 15, alignItems: 'center'},
      changeInformationButton: {backgroundColor: '#2b2929', borderRadius: 15, width: '80%', justifyContent: 'center', margin: 15, padding: 10},
      changeInformationText: { paddingLeft: 35, fontSize: 20, color: '#faa71a' },
      width: {
        width: '100%',
        height: '100%'
    },
    successField: {
        width: 300, 
        paddingLeft: 15, 
        backgroundColor: 'white', 
        borderRadius: 15, 
        padding: 10,
        marginTop: 15,
        backgroundColor: 'rgba(209,209,209,0.2)',
    },
    errorField: {
        borderColor: 'red',
        borderWidth: 2
    }
  });

export default styles;