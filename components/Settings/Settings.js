import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Image,
    AsyncStorage,
    TextInput
  } from 'react-native';
  
  import logo from '../../Images/logo.png';
  import styles from './style';

  class Settings extends Component {
    static navigationOptions = {
        title: 'Settings',
        
    }
    constructor(props) {
        super(props);
        this.state = {
          driverId: null,
          loading: false,
          clientToken: null,
          valueFirstName: '',
          valueLastName: '',
          valueCity: '',
          valuePhoneNumber: '',
          valueCurrentPass: '',
          valueNewPass: '',
          errorFields: false,
        }

    }
    componentDidMount() {
        AsyncStorage.getItem('driverId').then((value) => this.setState({driverId: value}));
        AsyncStorage.getItem('saveDataUserToken').then((value) => this.setState({clientToken: value}));
      }
    async testInfo() {
        if(this.state.valueFirstName === '' || this.state.valueFirstName === ' ') {
            this.setState({
                errorFields: true,
                valueFirstName: false
            })
        } else if(this.state.valueLastName === '' || this.state.valueLastName === ' ') {
            this.setState({
                errorFields: true,
                valueLastName: false
            })
        } else if(this.state.valuePhoneNumber === '' || this.state.valuePhoneNumber === ' ') {
            this.setState({
                errorFields: true,
                valuePhoneNumber: false
            })
        } else if(this.state.valueCurrentPass === '' || this.state.valueCurrentPass === ' ') {
            this.setState({
                errorFields: true,
                valueCurrentPass: false
            })
        } else if(this.state.valueNewPass === '' || this.state.valueNewPass === ' ') {
            this.setState({
                errorFields: true,
                valueNewPass: false
            })
        } else {
            this.setState({
                errorFields: false
            });
            fetch(`http://taxi-env.hsgu7qika6.us-east-2.elasticbeanstalk.com/api/accounts/customers/${this.state.driverId}`, {
                method: 'PUT',
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.state.clientToken,
                },
                body: JSON.stringify({
                    phoneNumber: this.state.valuePhoneNumber,
                    currentPassword: this.state.valueCurrentPass,
                    newPassword: this.state.valueNewPass,
                    firstName: this.state.valueFirstName,
                    lastName: this.state.valueLastName
                }),
            }).then((data) => {  
                if(data.ok === true) {
                    this.props.navigation.navigate('Profile');
                } else {
                    return Alert.alert("Error!!! Try again");
                }
            })  
            .catch((error) => {
                Alert.alert(error);
            });
        }
      }
      async onChangeInformation() {
        this.setState({
            loading: true
          });
          let data = this.testInfo();
          setTimeout(() => {
            this.setState({
              loading: false,
              answer: data._55
            });
          }, 2500);
      }
      render() {
          return(
            <View style={styles.container}>
                <View style={ styles.containerHeader }>
                    <View style={styles.containerLogo}>
                        <Image source={logo} style={styles.width} />
                    </View>
                </View>
                <View style={ styles.containerForm }>
                    <Text>Change information</Text>
                    <TextInput 
                        onChangeText={(value) => {this.setState({valueFirstName: value, errorFields: ''})}} 
                        value={this.state.valueFirstName} 
                        placeholder="First Name" 
                        style={this.state.valueFirstName !== false ? styles.successField : [styles.successField, styles.errorField]} 
                    />
                    <TextInput 
                        onChangeText={(value) => {this.setState({valueLastName: value, errorFields: ''})}} 
                        value={this.state.valueLastName} 
                        placeholder="Last Name" 
                        style={this.state.valueLastName !== false ? styles.successField : [styles.successField, styles.errorField]} 
                    />
                    <TextInput 
                        onChangeText={(value) => {this.setState({valuePhoneNumber: value, errorFields: ''})}} 
                        value={this.state.valuePhoneNumber} 
                        
                        placeholder="Phone Number" 
                        style={this.state.valuePhoneNumber !== false ? styles.successField : [styles.successField, styles.errorField]}  
                    />
                    <TextInput 
                        onChangeText={(value) => {this.setState({valueCurrentPass: value, errorFields: ''})}} 
                        value={this.state.valueCurrentPass} 
                        placeholder="Current password" 
                        secureTextEntry 
                        style={this.state.valueCurrentPass !== false ? styles.successField : [styles.successField, styles.errorField]}  
                    />
                    <TextInput 
                        onChangeText={(value) => {this.setState({valueNewPass: value, errorFields: ''})}} 
                        value={this.state.valueNewPass} 
                        placeholder="New password" 
                        secureTextEntry 
                        style={this.state.valueNewPass !== false ? styles.successField : [styles.successField, styles.errorField]} 
                    />
                </View>
                <TouchableOpacity onPress={() => {this.onChangeInformation()}} style={ changeInformationButton }>
                    <Text style={ styles.changeInformationText }>Change own information</Text>
                </TouchableOpacity>
            </View>
          );
      }
  }
  export default Settings;