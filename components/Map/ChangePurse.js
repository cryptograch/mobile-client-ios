import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    AsyncStorage,
    TextInput,
    Alert
  } from 'react-native';
  import logo from '../../Images/logo.png'
//   import logo from '../../images/logo.png';
//   import ProfileImg from '../../images/tabs/profile.png';
  import {QRscanner} from 'react-native-qr-scanner';
  import Loader from '../Loader/Loader';
  import styles from './style/styleChangePurse';

  class Profile extends Component {
    static navigationOptions = {
        title: 'Change purse',
        // tabBarIcon: () => (
        //   <Image
        //     source={ProfileImg}
        //     style={{height: 25, width: 25}}
        //   />
        // ),
      }
      constructor(props) {
          super(props);
          this.state = {
            getQrCode: false,
            repeatScan: false,
            zoom: 0,
            flashMode: false,
            valuePrivateKey: '',
            clientToken: '',
            loading: false
          }
      }
      onRead(res) {
        this.setState({
            repeatScan: false
        })
        if(res.data.length === 64) {
            this.setState({
                valuePrivateKey: res.data,
                repeatScan: false,
            })
        } else {
            Alert.alert(
                'Error',
                'Key must have length 64!!!',
                [
                    {text: 'Ok', onPress: () => this.setState({repeatScan: true})} 
                ],
                { cancelable: false })
            this.setState({
                repeatScan: false,
            })
        }
      }
      componentDidMount() {
        AsyncStorage.getItem('saveDataUserToken').then( async (value) => 
        {
          this.setState({clientToken: value})
        });
      }
      changePurse() {
          this.setState({
              loading: true
          })
        fetch('http://taxi-env.hsgu7qika6.us-east-2.elasticbeanstalk.com/api/location/driver', {
            method: 'PUT',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + this.state.clientToken,
            },
            body: JSON.stringify({
              privateKey: this.state.valuePrivateKey
            }),
        }).then((data) => {  
            console.log(data);
            this.setState({
                loading: false
            })
        })  
        .catch((error) => {
            console.log(error);
        });
      }
      render() {
          return(
            <View style={styles.container}>
                <View style={ styles.containerBlack }>
                    <View style={styles.containerLogo}>
                        <Image source={logo} style={styles.width} />
                    </View>
                    <Loader loading={this.state.loading} />
                    <View style={ styles.paddingCont }>
                        <View style={ styles.containerWhite }>
                            {
                                this.state.valuePrivateKey.length !== 64 ?
                                    <View style={[styles.marginTop, styles.widthQrScanner, {top: -25}]}>
                                        <QRscanner onRead={(data) => this.onRead(data)} isRepeatScan={this.state.repeatScan} flashMode={this.state.flashMode} zoom={this.state.zoom} finderY={50}/>
                                        <TouchableOpacity onPress={() => this.setState({valuePrivateKey: '', repeatScan: true})} style={[styles.backgroundColor, styles.tryAgain]}>
                                            <Text style={ styles.colorBlack }> Try again</Text>
                                        </TouchableOpacity>
                                    </View> 
                                    : 
                                    <View>
                                        <TextInput 
                                            style={[styles.input, styles.marginTown]} 
                                            placeholder="Town" 
                                            value={this.state.valuePrivateKey} 
                                            editable={false} 
                                            multiline={true}
                                            placeholderTextColor='rgba(225,225,225,0.7)'
                                        />
                                        <TouchableOpacity onPress={() => this.setState({valuePrivateKey: '', repeatScan: true})} style={[ styles.backgroundColor, styles.newTryAgain ]}>
                                            <Text style={{color: 'white', fontSize: 15}}> Try again</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={this.changePurse()} style={[ styles.saveChanges ]}>
                                            <Text style={{color: 'white', fontSize: 15}}>Save changes</Text>
                                        </TouchableOpacity>
                                    </View>
                                    
                            }
                        </View>
                    </View>
                    
                    
                </View>
            </View>
          );
      }
  }
export default Profile;