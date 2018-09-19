

import React, {Component} from 'react';
import {
  Text, 
  View, 
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  TouchableWithoutFeedback,
  AsyncStorage,
  Alert,
  Keyboard,
  ActivityIndicator
} from 'react-native';
import MapImg from '../../Images/tabs/map.jpg';
import carImg from '../../Images/car.jpg'; 
import carMarker from '../../Images/carMarker.png';
import geolib from 'geolib';
import axios from 'axios';
import MapViewDirections from 'react-native-maps-directions';
import MapView, { Marker } from 'react-native-maps';
import Loader from '../Loader/Loader';
import styles from './style/styleMap';
import * as signalR from '@aspnet/signalr';

class Map extends Component {
  static navigationOptions = {
    title: 'Map',
    tabBarIcon: () => (
      <Image
        source={MapImg}
        style={{height: 25, width: 25}}
      />
    ),
  }
  constructor(props) {
      super(props);
      this.hubConection = null;
      this.state = {
        myLatitude: 49.229058,
        myLongitude: 28.426778,
        contentTrips: null,
        seconds: null,
        valuePl: '',
        apiKey: 'AIzaSyDoC_s0xk5gGJEmu0BzIpRTWt4LCFcX8og',
        modalList: false,
        markerTrip: false,
        myTripData: null,
        distanceObject: null,
        clientToken: null,
        modalTrip: false,
        contentCars: [],
        windowFinishTrip: false,
        driverId: null,
        contentDriver: [],
        distanceObjectFin: null,
        driversLocation: [],
        myPrice: null,
        ImgUrl: null,
        showCancelTrip: false,
        messageCancelTrip: null,
        myCash: null,
        loading: false,
        mySignalR: [],
        getDriver: null,
        myDriver: false,
        myDriverLatitude: 0,
        myDriverLongitude: 0,
        MessageAlert: true,
        showFinder: true
      }
  }
  tripStatus() {
    fetch(`http://taxi-env.hsgu7qika6.us-east-2.elasticbeanstalk.com/api/Trips/customer/tripstatus`, {
          method: 'GET',
          withCredentials: true,
          credentials: 'include',
          headers: {
              'Authorization': 'Bearer ' + this.state.clientToken,
          }
        })
        .then( async (response) => {
          console.log(response);
          if(response.ok === true) {
            response = JSON.parse(response._bodyText);
            console.log(response);
            this.setState({
              driverId: response.driverId,
              showFinder: false
            });
            if(response.driverId !== null) {
              this.getDriverInfo(response.driverId);
              try {
                await this.hubConection.invoke('ConnectCustomer');
              } catch (err) {
                console.log(err);
              }
              this.setState({
                myDriver: true
              });
              this.hubConection.on('postGeoData', (lat, lon) => {
                this.setState({
                  myDriverLatitude: lat,
                  myDriverLongitude: lon
                });
              });
            }
          }
        });
  }
  getPhoto(carImg) {
    var url = `http://taxi-env.hsgu7qika6.us-east-2.elasticbeanstalk.com/api/images/${carImg}`;
      var self = this;
      axios.get(url, { headers: { "Authorization": 'Bearer ' + this.state.clientToken }, responseType:"blob" })
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
  getCarImage(carId) {
    fetch(`http://taxi-env.hsgu7qika6.us-east-2.elasticbeanstalk.com/api/vehicles/${carId}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.state.clientToken,
      },
    })
    // .then((response) => response.json())
    .then((response) => {
      if(response.ok === true) {
        console.log('image');
        response = JSON.parse(response._bodyText);
        console.log(response);
        if(response.pictures.length !== 0) {
          this.getPhoto(response.pictures[0]);
        }
      }
    })
    .catch((error) => {
      console.log(error);
    });
    
  }
  getDriverInfo(driverId) {
    fetch(`http://taxi-env.hsgu7qika6.us-east-2.elasticbeanstalk.com/api/accounts/drivers/${driverId}`)
    .then((response) => response.json())
    .then((response) => {
      console.log('driver info');
      console.log(response);
      if(response.vehicleId !== null) {
        this.getCarImage(response.vehicleId);
        this.setState({
          contentDriver: response
        })
      }
      
    })
  }
  getTrip() {
    AsyncStorage.getItem('saveDataLocation').then((value) => {
      if(value !== null) {
        value = JSON.parse(value);
        console.log(value);
        this.setState({
          markerTrip: true,
          windowFinishTrip: true,
          myTripData: value,
          myLatitude: value.myLatitude,
          myLongitude: value.myLongitude,
          valuePl: '',
        })
      } else{
        console.log("Sorry, but you don't have trips!!!");
      }
    })
  }
  refreshToken() {
    AsyncStorage.getItem('saveRefreshToken').then((res) => {
      console.log(res)
      fetch(`http://taxi-env.hsgu7qika6.us-east-2.elasticbeanstalk.com/api/Auth/refreshtoken?refreshToken=${res}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      })
      .then((dataRefreshToken) => dataRefreshToken.json())
      .then((dataRefreshToken) => {
        this.setState({
          clientToken: dataRefreshToken.auth_token
        });
        AsyncStorage.setItem('saveDataUserToken', dataRefreshToken.auth_token);
        AsyncStorage.setItem('saveRefreshToken', dataRefreshToken.refresh_token);
      }).catch((error) => {
        console.log('THIS IS ERROR REFRESH TOKEN');
        console.log(error);
      })
    })
  }
  async tick() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetch(`http://taxi-env.hsgu7qika6.us-east-2.elasticbeanstalk.com/api/location?Latitude=${position.coords.latitude}&Longitude=${position.coords.longitude}`, {
          method: 'GET',
          withCredentials: true,
          credentials: 'include',
          headers: {
              'Authorization': 'Bearer ' + this.state.clientToken,
          }
        })
        .then((response) => response.json())
        .then((response) => {
         console.log(response);
          if(response.length >= 0) {
            this.setState({
              driversLocation: response
            })

          } else {
            this.refreshToken();
          }
        })
        this.setState({
          myLatitude: position.coords.latitude,
          myLongitude: position.coords.longitude,
          error: null,
        });
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 }
    );
    this.myBalance();
    this.setState(prevState => ({
      seconds: prevState.seconds + 1
    }));
    if(this.state.windowFinishTrip === true) {
      try {
        this.tripStatus();
      } catch (err) {
        console.log(err);
      }
      
      let distance = geolib.getDistance(
        {latitude: this.state.myLatitude, longitude: this.state.myLongitude},
        {latitude: this.state.myTripData.geometry.location.lat, longitude: this.state.myTripData.geometry.location.lng}
      );
      this.setState({
        distanceObject: distance/1000
      });
    }
  }
  componentDidMount() {
    this.getTrip();
    AsyncStorage.getItem('saveDataUserToken').then( async (value) => 
        {
          if(value === null || value === undefined) {
            Alert.alert(
              'Error',
              'You must confirm your email or restart your app and Signin!!!',
              [
                {text: 'Ok', onPress: () => this.props.navigation.navigate('Home')} 
              ],
              { cancelable: false }
            );
          }
          let hubUrl = 'http://taxi-env.hsgu7qika6.us-east-2.elasticbeanstalk.com/route';
          this.hubConection = new signalR.HubConnectionBuilder()
          .withUrl(hubUrl, {
            accessTokenFactory: () => {
              return value
            }
          })
          .configureLogging(signalR.LogLevel.Information)
          .build();
          try {
            await this.hubConection.start();
          } catch (err) {
            console.log(err);
          }
          this.hubConection.invoke('ConnectCustomer');
          this.setState({clientToken: value})
        });
        
    this.interval = setInterval(() => this.tick(), 5000);
  }

  componentWillUnmount() {
    Keyboard.dismiss(); 
    clearInterval(this.interval);
  }
  componentWillMount() {
    Keyboard.dismiss(); 
  }
  handlePressTrip() {
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${this.state.valuePl}&key=${this.state.apiKey}`)
      .then((response) => response.json())
      .then((response) => {

        this.setState({
          contentTrips: response,
          modalList: true,
          windowFinishTrip: false
        })
    })
  }
  newTrip(item, index) {
    Keyboard.dismiss(); 
    // this.cancelTrip();
    fetch('http://taxi-env.hsgu7qika6.us-east-2.elasticbeanstalk.com/api/Trips/info', {
      method: 'POST',
      credentials: 'include',
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.state.clientToken,
      },
      body: JSON.stringify({
        from: {
          latitude: this.state.myLatitude,
          longitude: this.state.myLongitude
        },
        to: {
          latitude: item.geometry.location.lat,
          longitude: item.geometry.location.lng
        }
      })
    })
    .then((response) => response.json())
    .then((response) => {
      if(response !== 'No route to destination') {
        let distance = geolib.getDistance(
          {latitude: this.state.myLatitude, longitude: this.state.myLongitude},
          {latitude: item.geometry.location.lat, longitude: item.geometry.location.lng}
        );
        this.setState({
          myPrice: response.price,
          modalList: false,
          markerTrip: true,
          modalTrip: true,
          myTripData: item,
          distanceObject: distance/1000,
          valuePl: ''
        })
      }
      else {
        Alert.alert('Try again');
      }
    })
    .catch((error) => {
      console.log(error);
    });
    
  }
  deleteLastTrip() {
    this.setState({
      loading: true
    })
    AsyncStorage.removeItem('saveDataLocation');
    fetch('http://taxi-env.hsgu7qika6.us-east-2.elasticbeanstalk.com/api/Trips', {
      method: 'delete',
      headers: {
        'Authorization': 'Bearer ' + this.state.clientToken,
    }
  }).then((response) => {
    this.setState({
      loading: false
    });
    if(response.ok === false) {
      console.log('Error');
    } else {
      this.setState({
        markerTrip: false,
        distanceObject: null,
        windowFinishTrip: false,
        showFinder: true
      });
      // AsyncStorage.removeItem('saveDataLocation');
    }
  }).catch((error) =>
      console.log(error)
    )
  }
  addNewTrip() {
    this.setState({
      loading: true
    });
    fetch('http://taxi-env.hsgu7qika6.us-east-2.elasticbeanstalk.com/api/Trips', {
        method: 'POST',
        credentials: 'include',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.state.clientToken,
        },
        body: JSON.stringify({
          from: {
            latitude: this.state.myLatitude,
            longitude: this.state.myLongitude
          },
          to: {
            latitude: this.state.myTripData.geometry.location.lat,
            longitude: this.state.myTripData.geometry.location.lng
          }
        })
        })
        .then((response) => response.json())
        .then( (response) => {
          this.setState({
            loading: false
          })
          this.getTrip();
        })
        .catch((error) => {
            console.log(error);
        });
    this.setState({
      modalTrip: false,
      windowFinishTrip: true
    })
  }
  myBalance() {
    fetch(`http://taxi-env.hsgu7qika6.us-east-2.elasticbeanstalk.com/api/balance/tokens`, {
      method: 'GET',
      headers: {
          'Authorization': 'Bearer ' + this.state.clientToken,
      }
    })
    .then((response) => response.json())
    .then((response) => {
      this.setState({
        myCash: response
      })
    });
  }
  submitTrip() {
    if(this.state.myCash >= this.state.myPrice) {
      this.state.myTripData.myLatitude = this.state.myLatitude;
      this.state.myTripData.myLongitude = this.state.myLongitude;
      this.state.myTripData.price = this.state.myPrice;
      this.setState({
        showFinder: false
      });
      AsyncStorage.setItem('saveDataLocation', JSON.stringify(this.state.myTripData))
      this.addNewTrip();
    } else {
      Alert.alert(
        'Error',
        'Insufficient funds!!! You can buy tokens in shop!!!',
        [
          {text: 'Ok', onPress: () => this.props.navigation.navigate('BuyTokens')},
          {text: 'Cancel', onPress: () => this.setState({
            markerTrip: false,
            distanceObject: null,
            windowFinishTrip: false,
            modalTrip: false
          })} 
        ],
        { cancelable: false }
      );
    }
  }
  finishTrip() {
    this.setState({
      loading: true
    });
    fetch(`http://taxi-env.hsgu7qika6.us-east-2.elasticbeanstalk.com/api/Trips/customer/approvefinish`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.state.clientToken
        }
      })
      .then((response) => response.json())
      .then((response) => {
        this.setState({
          loading: false
        })
        if(response.price === this.state.myPrice) {
          this.setState({
            markerTrip: false,
            distanceObject: null,
            windowFinishTrip: false,
            driverId: null,
            contentDriver: null,
            myDriver: false,
            showFinder: true
          })
          AsyncStorage.removeItem('saveDataLocation');
        } 
      }).catch((error) => {
        console.log('THIS IS ERROR REFRESH TOKEN');
        console.log(error);
      })
    
  }
  cancelTrip() {
    this.deleteLastTrip();
    
  }
  cancelTripDriver() {
    this.setState({
      markerTrip: false,
      distanceObject: null,
      windowFinishTrip: false,
      showCancelTrip: true,
      contentDriver: null,
      driverId: null,
      myDriver: false
    })
    AsyncStorage.removeItem('saveDataLocation');
  }
  handleCancelTrip() {
    this.setState({
      loading: true,
      showCancelTrip: false,
      messageCancelTrip: null,
      showFinder: true
    });
    fetch('http://taxi-env.hsgu7qika6.us-east-2.elasticbeanstalk.com/api/Trips/customer/requestrefund', {
        method: 'POST',
        credentials: 'include',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.state.clientToken,
        },
        body: JSON.stringify({
          message: this.state.messageCancelTrip,
        })
      })
      .then((response) => {
        this.setState({
          loading: false
        })
      })
      .catch((error) => {
        console.log(error);
      });
      
  }
  render() {
    return (
      <View behavior="padding" style={styles.container}>
        {
          this.state.contentTrips !== null ? 
          <Modal 
            transparent={true}
            visible={this.state.modalList}
            animationType="slide"
            style={{width: '90%'}}
          >
            <TouchableOpacity 
              style={styles.containerTouchableOpacity}
              activeOpacity={1} 
              onPressOut={() => this.setState({ modalList: false })}
            >
                <TouchableWithoutFeedback>
                  <View 
                  style={styles.containerModalWindow}
                  >
                    <View style={{alignItems: 'center'}}>
                      <Text style={{fontSize: 25, fontWeight: 'bold'}}>Choose your trip</Text>
                    </View>
                    <ScrollView>
                      {
                        this.state.contentTrips.status === "OK" ? 
                          this.state.contentTrips.results.map((item, index) => 
                            <TouchableOpacity key={index}
                              style={{marginTop: 5, backgroundColor: '#2b2929', padding: 15, borderRadius: 15}}
                              onPress={this.newTrip.bind(this, item, index)}
                            >
                              <View style={{alignItems: 'center', justifyContent: 'center'}}><Text style={{color: '#faa71a', fontSize: 20}}>{item.formatted_address}</Text></View>
                            </TouchableOpacity>) :
                          <Text>Sorry, but you enter wrong data. Enter correct information!!!</Text>
                      }
                    </ScrollView>
                  </View>
                </TouchableWithoutFeedback>
              </TouchableOpacity>   
          </Modal> : null
        } 
          <MapView
            style={styles.map}
            showsUserLocation={true}
                initialRegion={{
                  latitude: this.state.myLatitude,
                  longitude: this.state.myLongitude,
                  latitudeDelta: 0.0043,
                  longitudeDelta: 0.0025,
                }}
          >
          { !this.state.myDriver ?
            this.state.driversLocation.Longitude === undefined ?
            this.state.driversLocation.map((item, index) => 
              <Marker
                key={index}
                coordinate={{latitude: item.latitude,
                longitude: item.longitude}}
              >
              <Image source={carMarker} style={{width: 40, height: 40}} />
              </Marker>
            ) : null
            :  
            <Marker
                coordinate={{latitude: this.state.myDriverLatitude,
                longitude: this.state.myDriverLongitude}}
              >
              <Image source={carMarker} style={{width: 40, height: 40}} />
              </Marker>
          }
          {
            this.state.markerTrip ?
                <Marker
                  coordinate={{latitude: this.state.myTripData.geometry.location.lat,
                  longitude: this.state.myTripData.geometry.location.lng}}
                  title={this.state.myTripData.formatted_address}
                  description={ this.state.distanceObject + " km"}
                /> 
                : null
          }

          { 
            this.state.markerTrip ? this.state.distanceObject > 0.10 ?
              <MapViewDirections
                origin={{latitude: this.state.myLatitude, longitude: this.state.myLongitude}}
                destination={{latitude: this.state.myTripData.geometry.location.lat, longitude: this.state.myTripData.geometry.location.lng}}
                strokeWidth={3}
                strokeColor={'red'}
                apikey={'AIzaSyDoC_s0xk5gGJEmu0BzIpRTWt4LCFcX8og'}
              /> : null
              : null
          }
          </MapView>
        {
                  this.state.windowFinishTrip ? this.state.distanceObject > 0.10 ?
                  <View style={{backgroundColor: 'white', position: 'absolute', flex: 1, top: '75%', width: '110%', height: '30%', padding: 15, alignItems: 'center', justifyContent: 'center'}}>
                    {
                      this.state.driverId !== null ? <View style={styles.alignItems}>
                        <Text>Your driver - {this.state.contentDriver !== null ? this.state.contentDriver.firstName : null} { this.state.contentDriver !== null ? this.state.contentDriver.lastName : null}!!!</Text>
                        <Text>Driver's phone - { this.state.contentDriver !== null ? this.state.contentDriver.phoneNumber : null}</Text>
                        <Image source={ this.state.ImgUrl !== null ? {uri: this.state.ImgUrl, isStatic:true} : carImg} style={{height: 70, width: 70, borderRadius: 35}} />
                        <View style={ styles.finishTripdriver }>
                          <TouchableOpacity
                            onPress={this.finishTrip.bind(this)}
                            style={ styles.cancelTripWithoutDr }
                          >
                            <Text style={ styles.colorOrange }>Finish trip</Text>
                          </TouchableOpacity>
                        </View>

                        <View style={ styles.cancelTripdriver }>
                          <TouchableOpacity
                            onPress={this.cancelTripDriver.bind(this)}
                            style={ styles.cancelTripWithoutDr }
                          >
                            <Text style={ styles.colorOrange }>Cancel trip</Text>
                          </TouchableOpacity>
                        </View>
                        
                      </View> : 
                      <View style={{alignItems: 'center'}}>
                        <Text>Wait please, drivers submit order!!!</Text>
                        <TouchableOpacity
                          onPress={this.cancelTrip.bind(this)}
                          style={ styles.cancelTripWithoutDr }
                        >
                          <Text style={ styles.colorOrange }>Cancel trip</Text>
                        </TouchableOpacity>
                      </View>
                        
                    }
                  </View> : this.state.distanceObject !== null ?
                    <View style={styles.finishTrip}>
                      <TouchableOpacity
                        onPress={this.finishTrip.bind(this)}
                        style={ styles.finishTripButton }
                      >
                        <Text style={styles.colorOrange}>Finish</Text>
                      </TouchableOpacity>
                    </View> : null
                  : null
                }
        {
          this.state.showFinder ? 
            <View style={styles.inputWrapper}>
              <TextInput 
                style={styles.inputSearch}
                value={this.state.valuePl}
                onChangeText={(text) => this.setState({valuePl: text})} 
                placeholder="Enter your place"
                placeholderTextColor="white"

              />
              <TouchableOpacity 
                onPress={this.handlePressTrip.bind(this)}
                style={ styles.findTrip }>
                <Text style={styles.colorOrange}>Find</Text>
              </TouchableOpacity>
            </View> 
          : null
        }
        {
          this.state.modalTrip ? 
          <View style={ styles.contentMessageTrip }>
              <Image source={carImg} style={ styles.imageCar } />
              {
                this.state.myPrice !== null ? <Text style={{fontWeight: 'bold', fontSize: 20}}>Price: {this.state.myPrice}</Text> 
                : <ActivityIndicator animating={this.state.myPrice} size="large" color="#17316E" />
              }
              
            <TouchableOpacity
                onPress={this.submitTrip.bind(this)}
                style={styles.submitTrip}
              >
                <Text style={ styles.colorOrange }>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.setState({modalTrip: false, markerTrip: false})}
                style={styles.cancelTrip}
              >
                <Text style={styles.colorOrange}>Cancel</Text>
              </TouchableOpacity> 
            </View>: null
        }
        <Loader loading={this.state.loading} />
        {
          this.state.showCancelTrip ? 
          <Modal 
            transparent={true}
            visible={this.state.showCancelTrip}
          >
                <ScrollView 
                  directionalLockEnabled={true} 
                  contentContainerStyle={styles.containerTouchableOpacity}
                >
                  <TouchableWithoutFeedback>
                    <View style={[styles.containerModalWindowCancelTrip]}>
                      <View style={styles.alignItems}>
                        <Text style={styles.colorWhite}>Hello, You want to cancel trip!!!</Text>
                      </View>
                      
                      <Text style={styles.colorWhite}>If you want to return money, you must write message to administrator and he return your money!</Text>
                      <View style={styles.textAreaContainer} >
                        <TextInput
                          style={styles.textArea}
                          placeholder={"Enter message for administrator"}
                          placeholderTextColor={"grey"}
                          multiline={true}
                          onChangeText={(text) => this.setState({messageCancelTrip: text})}
                        />
                      </View>
                      <TouchableOpacity onPress={this.handleCancelTrip.bind(this)} style={[styles.backgroundColorOrange, styles.sentMessageAdmin]}>
                        <Text style={styles.colorOrange}>Send message</Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableWithoutFeedback>
                </ScrollView> 
            </Modal> : null
        }
      </View>
    );
  }
}
export default Map;
