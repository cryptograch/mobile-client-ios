

import React, {Component} from 'react';
import {
  Text, 
  View, 
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  TextInput,
  AsyncStorage, 
} from 'react-native';
import Loader from '../Loader/Loader';
import Account from '../../Images/account.png';
import Password from '../../Images/password.png';
import logo from '../../Images/Signin1.png';
import styles from './style';

class Home extends Component {
  static navigationOptions = { title: 'Welcome', header: null };
  constructor(props) {
    super(props);
    this.state = {
        valuePassword: '',
        valueLogin: '',
        answer: null,
        loading: null,
        errorFields: false,
        signinUser: false,
    }
  }
  getRequest() {
    fetch('http://taxi-env.hsgu7qika6.us-east-2.elasticbeanstalk.com/api/Auth/customer', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: this.state.valueLogin,
          password: this.state.valuePassword
        }),
      })
      .then((data) => data.json())
      .then((data) => {  
        if(data.auth_token !== undefined ) { 
          AsyncStorage.setItem('driverId', data.id);
          AsyncStorage.setItem('saveDataUserToken', data.auth_token); 
          AsyncStorage.setItem('saveRefreshToken', data.refresh_token);
          this.setState({
            loading: false,
            valueLogin: '',
            valuePassword: ''
          })          
          return( this.props.navigator.navigate('Map'));
        } else { 
          this.setState({
            signinUser: true,
            loading: false,
            valueLogin: '',
            valuePassword: ''
          }) 
        }
      }).catch((error) => {
        this.setState({
          errorFields: true
        })
      });
  }
  async signin() {
    let reg = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if(this.state.valueLogin === '' || this.state.valueLogin === ' ' || reg.test(this.state.valueLogin) === false) {
      this.setState({
        errorFields: true,
        valueLogin: false,
        loading: false
      })
    } else if(this.state.valuePassword === '' || this.state.valuePassword === ' ') {
      this.setState({
        errorFields: true,
        valuePassword: false,
        loading: false
      })
    } else {
      this.getRequest();
    }
  }
  async getRequestSignin() {
    this.setState({
      loading: true
    });
    let data = this.signin();
  }
  render() {
    return (
      <View style={styles.container}>
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
            <View style={styles.loginContainer}>
                <Image resizeMode="contain" style={styles.logo} source={logo} />
            </View>
            <View style={styles.topName}>
                <Text style={styles.app}>TAXI COIN</Text>
            </View>
            <Loader loading={this.state.loading} />
            <KeyboardAvoidingView style={styles.signin}>
                {
                    this.state.errorFields ? 
                        <View style={styles.alignCenter}>
                            <Text style={styles.textColor}>Please enter correct data!!!</Text>
                        </View> : null
                }
                {
                    this.state.signinUser ? 
                        <View style={[styles.alignCenter, styles.marginTopError]}>
                            <Text style={styles.textColor}>Email not confirmed</Text><Text style={styles.textColor}>or</Text><Text style={{color: 'red'}}>Invalid username or password</Text>
                        </View> : null
                }
                <View>
                    <TextInput 
                        placeholder="Enter email" 
                        placeholderTextColor="silver" 
                        style={this.state.valueLogin !== false ? styles.email : [styles.emailError, styles.email]} 
                        autoCapitalize = 'none' 
                        autoCorrect={false}  
                        onChangeText={(text) => this.setState({valueLogin: text, errorFields: '', signinUser: ''})} 
                        value={this.state.valueLogin}  
                    />
                    <Image source={Account} style={styles.imgAccount} />
                </View>
                <View style={styles.top}>
                    <TextInput 
                        placeholder="Enter password" 
                        placeholderTextColor="silver" 
                        style={this.state.valuePassword !== false ? styles.email : [styles.emailError, styles.email]} 
                        onChangeText={(text) => this.setState({valuePassword: text, errorFields: '', signinUser: ''})} 
                        autoCorrect={false} 
                        value={this.state.valuePassword} 
                        secureTextEntry 
                    />
                    <Image source={Password} style={styles.imgPassword} />
                </View>
            </KeyboardAvoidingView>
            <TouchableOpacity style={styles.linkApp} onPress={() => this.getRequestSignin()}>
                <Text style={styles.app}>Login</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

export default Home;