

import React, {Component} from 'react';
import {
  Text, 
  View, 
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  TextInput,
  AsyncStorage, 
  Modal,
  ScrollView,
  TouchableWithoutFeedback,
  Alert,
  Linking
} from 'react-native';
import Loader from '../Loader/Loader';
import {QRscanner} from 'react-native-qr-scanner';
import Secure from '../../Images/secure.jpg';
import styleRegistration from './style';



class Registration extends Component {
  static navigationOptions = { title: 'Welcome', header: null };
  constructor(props) {
    super(props);
    this.state = {
        answer: null,
        loading: null,
        errorFields: false,
        valueEmailRegistration: '',
        valuePasswordRegistration: '',
        valuefirstName: '',
        valueLastName: '',
        valueRepeatPass: '',
        valueNumberPhone: '',
        valuePrivateKey: '',
        errorFieldsPass: false,
        showModal: false,
        getQrCode: false,
        repeatScan: false,
        trueScann: false
    }
    this.handleNextPage = this.handleNextPage.bind(this);
  }
  getRequest() {
    fetch('http://taxi-env.hsgu7qika6.us-east-2.elasticbeanstalk.com/api/accounts/customers', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: this.state.valueEmailRegistration,
          phoneNumber: this.state.valueNumberPhone,
          password: this.state.valuePasswordRegistration,
          firstName: this.state.valuefirstName,
          lastName: this.state.valueLastName,
          privateKey: this.state.valuePrivateKey
        }),
      })
      .then((data) => data.json())
      .then((data) => {  
        if(data.id !== undefined ) { 
          AsyncStorage.setItem('driverId', data.id);
        } else { 
          this.setState({
            userName: true,
          }) 
        }
      }).catch((error) => {
        this.setState({
          errorFields: true
        })
      });
  }
  registration() {
    let reg = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if(this.state.valuefirstName === '' || this.state.valueLastName === ' ') {
      this.setState({
        errorFields: true,
        valuefirstName: false
      })
    } else if(this.state.valueLastName === '' || this.state.valueLastName === ' ') {
      this.setState({
        errorFields: true,
        valueLastName: false
      })
    } else if(this.state.valuePasswordRegistration === '' || this.state.valuePasswordRegistration === ' ') {
      this.setState({
        errorFields: true,
        valuePasswordRegistration: false
      })
    }
    else if(this.state.valueRepeatPass !== this.state.valuePasswordRegistration) {
      this.setState({
        errorFieldsPass: true,
        valueRepeatPass: false
      })
    } 
    else if(this.state.valueNumberPhone === '' || this.state.valueNumberPhone === ' ') {
      this.setState({
        errorFields: true,
        valueNumberPhone: false
      })
    }
    else if(this.state.valueEmailRegistration === '' || this.state.valueEmailRegistration === ' ' || reg.test(this.state.valueEmailRegistration) === false) {
      this.setState({
        errorFields: true,
        valueEmailRegistration: false
      })
      
    } 
    else if(this.state.valuePrivateKey === '' || this.state.valuePrivateKey === ' ' || this.state.valuePrivateKey.length !== 64) {
      this.setState({
        errorFields: true,
        valuePrivateKey: '1123'
      })
    } else {
        this.setState({
          showModal: true
        })
      this.getRequest();
    }
  }
  async getRequestRegistration() {
    this.setState({
      loading: true
    });
    let data = await this.registration();
    setTimeout(() => {
      this.setState({
        loading: false,
        answer: data
      });
    }, 2500);
  }
   handleNextPage() {
    this.setState({
        loading: null
    });
    this.props.navigator.navigate('Map');
  }
  openApp() {
    Linking.canOpenURL('app-settings:').then(supported => {
      Linking.openURL('app-settings:')
  }).catch(error => {
      console.log(`An error has occured: ${error}`)
  })
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
  render() {
    return (
      <KeyboardAvoidingView behavior="padding" style={styleRegistration.container}>
        <ScrollView>
          <View style={[styleRegistration.topName, styleRegistration.alignCenter]}>
                        <Text style={styleRegistration.app2}><Text style={styleRegistration.colorOrange} >TAXI</Text> COIN</Text>
                      </View>
                      <Loader loading={this.state.loading} />
                      <View style={styleRegistration.signin}>
                        {
                          this.state.errorFields ? 
                          <View style={styleRegistration.alignCenter}>
                            <Text style={styleRegistration.colorRed}>Please enter correct data!!!</Text>
                          </View> : null
                        }
                        {
                          this.state.errorFieldsPass ? 
                          <View style={styleRegistration.alignCenter}>
                            <Text style={styleRegistration.colorRed}>Passwords are diferent!!!</Text>
                          </View> : null
                        }
                        {
                          this.state.userName ? 
                            <View style={styleRegistration.alignCenter}>
                              <Text style={styleRegistration.colorRed}>Email already taken!!!</Text>
                            </View> : null
                        }
                        {
                          this.state.valuePrivateKey === '1123'  ? 
                            <Text style={styleRegistration.colorRed}>Key must has length 64!!!</Text> : null
                        }
                          <View>
                            {
                                !this.state.loading && this.state.loading !== null ?
                                <Modal 
                                    transparent={true}
                                    visible={this.state.showModal}
                                >
                                    <TouchableOpacity 
                                        style={styleRegistration.containerTouchableOpacity}
                                        activeOpacity={1} 
                                    >
                                        <ScrollView 
                                            directionalLockEnabled={true} 
                                            contentContainerStyle={styleRegistration.containerTouchableOpacity}
                                        >
                                            <TouchableWithoutFeedback>
                                                <View style={styleRegistration.containerModalWindow}>
                                                    <Text>Hello {this.state.valuefirstName} {this.state.valueLastName}!!!</Text>
                                                    <Text>Please confirm your account by this ref <Text style={styleRegistration.colorBlue} onPress={this.openApp.bind(this)}>link</Text> or log in to your email and confirm your account</Text>
                                                    <View>
                                                        <Image source={Secure} style={ styleRegistration.secureIcon} />
                                                    </View>
                                                    <TouchableOpacity onPress={this.handleNextPage} style={[styleRegistration.backgroundColorLightBlue, styleRegistration.confirmEccount]}>
                                                        <Text style={ styleRegistration.colorWhite}>Confirm account later</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </TouchableWithoutFeedback>
                                        </ScrollView>
                                    </TouchableOpacity>   
                                </Modal> : null
                            }
                              <TextInput 
                                  placeholder="Enter first name" 
                                  placeholderTextColor="silver" 
                                  style={ this.state.valuefirstName !== false ? styleRegistration.email : [styleRegistration.email, styleSignin.emailError]} 
                                  autoCapitalize = 'none' 
                                  autoCorrect={false}  
                                  onChangeText={(text) => this.setState({valuefirstName: text, errorFields: ''})} 
                              />
                          </View>
                          <View style={styleRegistration.top}>
                              <TextInput 
                                  placeholder="Enter last name" 
                                  placeholderTextColor="silver" 
                                  style={ this.state.valueLastName !== false ? styleRegistration.email : [styleRegistration.email, styleSignin.emailError]}  
                                  onChangeText={(text) => this.setState({valueLastName: text, errorFields: '', userName: ''})} 
                                  autoCorrect={false} 
                                   
                              />
                          </View>
                          <View style={styleRegistration.top}>
                              <TextInput 
                                  placeholder="Enter password" 
                                  placeholderTextColor="silver" 
                                  style={ this.state.valuePasswordRegistration !== false ? styleRegistration.email : [styleRegistration.email, styleSignin.emailError]} 
                                  onChangeText={(text) => this.setState({valuePasswordRegistration: text, errorFields: '', userName: ''})} 
                                  autoCorrect={false} 
                                  secureTextEntry 
                              />
                          </View>
                          <View style={styleRegistration.top}>
                              <TextInput 
                                  placeholder="Repeat password" 
                                  placeholderTextColor="silver" 
                                  style={ this.state.valueRepeatPass !== false ? styleRegistration.email : [styleRegistration.email, styleSignin.emailError]} 
                                  onChangeText={(text) => this.setState({valueRepeatPass: text, errorFields: '', errorFieldsPass: '', userName: ''})} 
                                  autoCorrect={false} 
                                  secureTextEntry 
                              />
                          </View>
                          <View style={styleRegistration.top}>
                              <TextInput 
                                  placeholder="Enter phone number" 
                                  placeholderTextColor="silver" 
                                  keyboardType='numeric'
                                  style={ this.state.valueNumberPhone !== false ? styleRegistration.email : [styleRegistration.email, styleSignin.emailError]} 
                                  onChangeText={(text) => this.setState({valueNumberPhone: text, errorFields: '', userName: ''})} 
                                  autoCorrect={false}  
                              />
                          </View>
                          <View style={styleRegistration.top}>
                              <TextInput 
                                  placeholder="Enter email" 
                                  placeholderTextColor="silver" 
                                  style={ this.state.valueEmailRegistration !== false ? styleRegistration.email : [styleRegistration.email, styleSignin.emailError]} 
                                  onChangeText={(text) => this.setState({valueEmailRegistration: text, errorFields: '', userName: ''})} 
                                  autoCorrect={false} 
                              />
                          </View>
                          <View style={[styleRegistration.top]}>
                          {
                            this.state.getQrCode ? 
                            this.state.valuePrivateKey.length !== 64 ? 
                              <View style={[styleRegistration.marginTopScanner, styleRegistration.widthQrScanner, {top: -50}]}>
                                <QRscanner onRead={(data) => this.onRead(data)} isRepeatScan={this.state.repeatScan} flashMode={this.state.flashMode} zoom={this.state.zoom} finderY={50}/>
                                <TouchableOpacity onPress={() => this.setState({valuePrivateKey: '', repeatScan: true})} style={[styleRegistration.backgroundColorOrange, styleRegistration.tryAgain]}>
                                  <Text style={[styleRegistration.colorOrange, {fontSize: 20}]} > Try again</Text>
                                </TouchableOpacity>
                              </View> 
                              : 
                              <TextInput 
                                style={[styleRegistration.marginTopScanner]} 
                                placeholder="Town" 
                                value={this.state.valuePrivateKey} 
                                editable={false} 
                                placeholderTextColor='rgba(225,225,225,0.7)'
                              />
                              : <TouchableOpacity onPress={() => this.setState({getQrCode: true})} style={[styleRegistration.backgroundColorOrange, styleRegistration.scanCode]}>
                                  <Text style={[styleRegistration.textStyle, styleRegistration.colorOrange]}>Scan QR Code</Text>
                                </TouchableOpacity>
                          }
                          </View>
                      </View>
                      <TouchableOpacity style={[styleRegistration.linkApp, this.state.getQrCode && !this.state.trueScann ? {marginTop: -25} : null]} onPress={() => this.getRequestRegistration()}>
                        <Text style={styleRegistration.app}>Login</Text>
                      </TouchableOpacity>
                      {
                        this.state.getQrCode ? <View style={styleRegistration.splace}></View> : null
                      }
                      
                </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

export default Registration;
