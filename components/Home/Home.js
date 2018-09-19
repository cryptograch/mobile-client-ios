import React, {Component} from 'react';
import {
  Text, 
  View, 
  AsyncStorage, 
  Linking
} from 'react-native';
import Video from 'react-native-video';
import Signin from '../Signin/Signin';
import Registration from '../Registration/Registration';
import BackgroundVideo from '../../video/StreetBackground.mp4';
import styles from './style';


class Home extends Component {
  static navigationOptions = { title: 'Welcome', header: null };
  constructor(props) {
    super(props);
    this.state = {
        registration: false,
    }
  }
  componentDidMount() {
    AsyncStorage.getItem('saveDataUserToken').then((value) => {
      if(value !== null)
        this.props.navigation.navigate('Map')
    });
  }
  openApp() {
    Linking.canOpenURL('app-settings:').then(supported => {
      Linking.openURL('app-settings:')
    }).catch(error => {
      console.log(`An error has occured: ${error}`)
    })
  }
  render() {
    return (
      <View style={styles.container}>
        <Video
          source={BackgroundVideo}
          rate={1.0}
          volume={1.0}
          muted={false}
          resizeMode={"cover"}
          repeat={true}
          style={styles.video}
        />
       <View style={styles.marginTop}>
            {
                this.state.registration ? 
                  <View style={styles.containerRegistration}>
                      <Registration navigator={this.props.navigation} />
                      <Text style={styles.Signin} onPress={() => this.setState({registration: false})}>Sign in</Text>
                  </View> : 
                  <View>
                    <Signin navigator={this.props.navigation} />
                    <Text style={styles.createAccount} onPress={() => this.setState({registration: true})}>Create account</Text>
                    <Text style={styles.forgotPass} onPress={() => {Linking.openURL('https://devtaxiapp.herokuapp.com/forgot-password')}}>Forgot password</Text>
                  </View>
            }
        </View>
        <View style={styles.linkApp}>
          <Text style={styles.app} onPress={this.openApp.bind(this)}>Do you search app for drivers?</Text>
        </View>
        
      </View>
    );
  }
}

export default Home;
