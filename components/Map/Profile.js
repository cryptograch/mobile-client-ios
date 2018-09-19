import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Image,
    ScrollView,
    AsyncStorage,
    ActivityIndicator
  } from 'react-native';
  import styles from './style/styleProfile';
  
  import ImagePicker from 'react-native-image-picker';
  import logo from '../../Images/logo.png';
  import ProfileImg from '../../Images/tabs/profile.png';
  import ImageExit from '../../Images/Profile/Exit.jpg';
  import ImageSettings from '../../Images/Profile/Settings.png';
  import axios from 'axios';

  class Profile extends Component {
    static navigationOptions = {
      title: 'Profile',
      tabBarIcon: () => (
        <Image
          source={ProfileImg}
          style={{height: 25, width: 25}}
        />
      ),
    }
    constructor(props) {
      super(props);
      this.state = {
        driverId: null,
        content: [],
        ImageSource: logo,
        clientToken: null,
        ImgUrl: null,
        myCash: null,
        getMyInfo: true
      }
    }
    settngs() {
      this.props.navigation.navigate('Settings');
    }
    myCash() {
      fetch(`http://taxi-env.hsgu7qika6.us-east-2.elasticbeanstalk.com/api/balance/tokens`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + this.state.clientToken,
        }
      })
      .then((response) => response.json())
      .then((response) => {
        this.setState({
          myCash: response,
          getMyInfo: false
        })
      });
    }
    getUserInfo(driverId) {
      fetch(`http://taxi-env.hsgu7qika6.us-east-2.elasticbeanstalk.com/api/accounts/customers/${driverId}`)
      .then((response) => response.json())
      .then((response) => {
        this.setState({
          content: response
        })
        AsyncStorage.getItem('saveDataUserToken').then((value) => {
          this.setState({
            clientToken: value
          })
          this.getUserImage(value, response.profilePictureId);
        });
      })
    }
      getUserImage(userAuthToken, imageId) {
        if(imageId !== null) {
          var url = `http://taxi-env.hsgu7qika6.us-east-2.elasticbeanstalk.com/api/images/${imageId}`;
              var self = this;
              axios.get(url, { headers: { "Authorization": 'Bearer ' + userAuthToken }, responseType:"blob" })
              .then((response) => {
                  var reader = new window.FileReader();
                  reader.readAsDataURL(response.data); 
                  reader.onload = function() {
                      var imageDataUrl = reader.result;
                      self.setState({
                          ImgUrl: imageDataUrl
                      })
                  }
              });
        }
        
      }
      tick() {
        this.getUserInfo(this.state.driverId);
        this.myCash();
      }
      componentDidMount() {
        AsyncStorage.getItem('driverId').then((value) => {
          this.setState({
              driverId: value
          });
          this.getUserInfo(value);
          
        });
        this.interval = setInterval(() => this.tick(), 5000);
      }
      componentWillUnmount() {
        clearInterval(this.interval);
      }
      selectPhotoTapped() {
        const options = {
          quality: 1.0,
          maxWidth: 500,
          maxHeight: 500,
          storageOptions: {
            skipBackup: true
          }
        };
    
        ImagePicker.showImagePicker(options, (response) => {
          console.log('Response = ', response);
    
          if (response.didCancel) {
            console.log('User cancelled photo picker');
          }
          else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
          }
          else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
          }
          else {
            let source = { uri: response.uri };
            let files = new FormData();

            files.append("files", {uri: source.uri, name: 'image.jpg', type: 'multipart/form-data'})


            fetch('http://taxi-env.hsgu7qika6.us-east-2.elasticbeanstalk.com/api/profilepicture',{
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data',
                    'Authorization': 'Bearer ' + this.state.clientToken,
                },
                body: files

            })
            .then(resp => resp.json())
            .then(resp => {
                AsyncStorage.setItem('saveDataUserPicture', resp.imageId);
            }).catch(err => {
                console.log(err)
            }) 
            this.setState({
              ImageSource: source,
              ImgUrl: null
            });
          }
        });
      }
      async clearInformation() {
        AsyncStorage.removeItem('driverId');
        AsyncStorage.removeItem('saveDataUserToken');
        AsyncStorage.removeItem('trip');
        AsyncStorage.removeItem('saveDataLocation');
        this.props.navigation.navigate('Home');
        
      }
      render() {
          return(
            <View style={styles.container}>
                <View style={styles.backgroundColorHeader}>
                    <View style={styles.containerLogo}>
                        <Image source={logo} style={styles.width} />
                    </View>
                </View>
                <ScrollView style={styles.padding}>
                        <View style={ styles.contentPage }>
                        <TouchableOpacity style={ styles.changeImg } onPress={this.selectPhotoTapped.bind(this)}>
                                <Image 
                                    source={ 
                                      this.state.ImgUrl !== null ? 
                                      {uri: this.state.ImgUrl, isStatic:true} : this.state.ImageSource
                                    } 
                                    style={styles.imgProfile} 
                                />
                            </TouchableOpacity>
                            
                            <View style={styles.widthContainer}>
                              {
                                !this.state.getMyInfo ? 
                                  <View>
                                    <Text style={styles.fontSize}>First Name: <Text style={ styles.firstName }>{this.state.content.firstName}</Text></Text>
                                    <Text style={styles.fontSize}>Last Name: <Text style={ styles.lastName }>{this.state.content.lastName}</Text></Text>
                                    <Text style={styles.fontSize}>Phone: <Text style={ styles.phoneNumber }>{this.state.content.phoneNumber}</Text></Text>
                                    <Text style={styles.fontSize}>Email: <Text style={ styles.email }>{this.state.content.email}</Text></Text>
                                    <Text style={styles.fontSize}>My money: <Text style={ styles.myMoney }>{this.state.myCash} TC</Text></Text>
                                  </View> 
                                : 
                                  <View style={[styles.myInfo, styles.marginTop, styles.marginLeft]}>
                                    <ActivityIndicator animating={this.state.getMyInfo} size="large" color="#17316E" />
                                  </View>  
                              }
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('Messages')} style={ styles.navigateToMessage }>
                                  <Text style={ styles.message }>Messages</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('BuyTokens')} style={ styles.navigateToMessage }>
                                  <Text style={ styles.buyToken }>Buy TC</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => {this.settngs()}} style={ styles.changeSettings }>
                          <Image source={ImageSettings} style={ styles.imgSettings } />
                          <Text style={ styles.settngs }>Settings</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.changeSettings} onPress={() => this.props.navigation.navigate('ChangePurse')}>
                          <Image style={ styles.imgSettingsPurse } source={ImageSettings} />
                          <Text style={ styles.settngs }>Change my purse</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {this.clearInformation()}} style={ styles.changeImg }>
                          <Image source={ImageExit} style={ styles.imgExit } />
                          <Text style={ styles.exit }>Exit</Text>
                        </TouchableOpacity>
                        <View style={ styles.height }></View>
                </ScrollView>   
            </View>
          );
      }
  }

  export default Profile;