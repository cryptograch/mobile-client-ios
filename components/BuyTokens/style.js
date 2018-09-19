import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
    },
    ImageCoin: {height: 25, width: 25},
    inputTokens: {width: '100%', height: 50, padding: 15, backgroundColor: 'silver', borderRadius: 15},
    widthCon: {width: '100%'},
    containerBuyTokens: {backgroundColor: '#2b2929', borderRadius: 15, width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 5, height: 50},
    buyTokens: {fontSize: 20, color: '#faa71a'},
    positionAbs: {position: 'absolute', left: 175},
    greenColor: {
        color: 'green'
    },
    redColor: {
        color: 'red'
    },
    containerImg3: {position: 'absolute', left: 80, top: -5},
    containerImg2: {position: 'absolute', left: 9, top: -5},
    containerImg: {position: 'absolute', left: 180, top: 25},
    containerInput: {width: '100%', marginTop: 15},
    containerWhiteBack: {backgroundColor: 'white', padding: 25, borderRadius: 15, marginTop: 15},
    containerETH: {position: 'absolute', left: 150, top: 10},
    containerTXC: {backgroundColor: 'white', padding: 25, borderRadius: 15, marginTop: 15},
    imgTXC: {height: 100, width: 100},
    TXC: {position: 'absolute', left: 150, top: 10},
    fontWeight: {fontWeight: 'bold'},
    containerWhite: {
        backgroundColor: 'white', 
        padding: 15, 
        alignItems: 'center', 
        borderRadius: 15, 
    },

  })

export default styles;