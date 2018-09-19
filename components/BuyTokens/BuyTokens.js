import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    AsyncStorage,
    ActivityIndicator,
    ScrollView,
    Image
  } from 'react-native';
  import Loader from '../Loader/Loader';
  import Ethereum from '../../Images/Ethereum.png';
  import ETHIcon from '../../Images/ETHIcon.png';
  import LogoTC from '../../Images/logoTC.png';
  import styles from './style';

  class BuyTokens extends Component {
      static navigationOptions = {
        title: 'Shop'
      }
      constructor(props) {
          super(props);
          this.state = {
            Ethereum: 0,
            quantity: '',
            clientToken: null,
            myCash: null,
            message: '',
            loading: false,
            getIndicator: true,
            ETH: []
          }
      } 
      tick() {
        this.myBalance(this.state.clientToken);
        this.myEthereum(this.state.clientToken);
      }
      myEthereum(token) {
        fetch(`http://taxi-env.hsgu7qika6.us-east-2.elasticbeanstalk.com/api/balance/ethereum`, {
          method: 'GET',
          headers: {
              'Authorization': 'Bearer ' + token,
          }
        })
        .then((response) => response.json())
        .then((response) => {
          this.setState({
            Ethereum: response/1000000000000000000
          })
        });
      }
      myBalance(token) {
        fetch(`http://taxi-env.hsgu7qika6.us-east-2.elasticbeanstalk.com/api/balance/tokens`, {
          method: 'GET',
          headers: {
              'Authorization': 'Bearer ' + token,
          }
        })
        .then((response) => response.json())
        .then((response) => {
          this.setState({
            myCash: response
          })
        });
      }
      async componentDidMount() {
        this.setState({
            getIndicator: true
        })
        AsyncStorage.getItem('saveDataUserToken').then( async (value) => {
            this.setState({
                clientToken: value
            })
            try {
                await this.myBalance(value);
                await this.myEthereum(value);
            } catch (err) {
                console.log(err);
            }
            this.setState({
                getIndicator: false
            })
            
        })
        this.getInfoAboutEthereum();
        this.interval = setInterval(() => this.tick(), 5000);
      }
      componentWillUnmount() {
        clearInterval(this.interval);
      }
      postBuyToken() {
        fetch(`http://taxi-env.hsgu7qika6.us-east-2.elasticbeanstalk.com/api/deposit`, {
            method: 'POST',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.state.clientToken,

            },
            body: JSON.stringify({
                value: this.state.quantity
            }),
        })
        .then((response) => {
            if(response.ok) {
                this.setState({
                    loading: false,
                    message: 'Operation is successful'
                })
            } else {
                this.setState({
                    loading: false,
                    message: 'Operation is fall'
                })
            }
            
        }).catch((error) => {
            console.log(error);
        })
      }
      async buyTokensFunc() {
          this.setState({
              loading: true
          })
        let data = await this.postBuyToken();
        
        this.setState({
            quantity: ''
        })
      }
      getInfoAboutEthereum() {
          fetch('https://api.coinmarketcap.com/v1/ticker/ethereum/')
          .then((response) => response.json())
          .then((response) => {
              this.setState({
                  ETH: response[0]
              });
          })
          .catch(err => {
              console.log(err);
          })
      }
      render() {
          return(
            <View style={styles.container}>
                <ScrollView>
                    <View style={ styles.containerWhite }>
                        {
                            !this.state.getIndicator ? 
                                <View>
                                    <Text style={{fontSize: 20}}>My Ethereum: {this.state.Ethereum.toFixed(3)}</Text>
                                    <View style={ styles.positionAbs }>
                                        <Image source={ETHIcon} style={ styles.ImageCoin } />
                                    </View>
                                    <Text style={{fontSize: 20}}>My Taxi Coin: {this.state.myCash}</Text>
                                    <View style={ styles.containerImg }>
                                        <Image source={LogoTC} style={styles.ImageCoin } />
                                    </View>
                                    <View style={{marginTop: 15}}>
                                        <Text>1 {"      "} = 0,001</Text>
                                        <View style={ styles.containerImg2 }>
                                            <Image source={LogoTC} style={styles.ImageCoin } />
                                        </View>
                                        <View style={ styles.containerImg3 }>
                                            <Image source={ETHIcon} style={styles.ImageCoin } />
                                        </View>
                                    </View>
                                </View>
                            : 
                                <View>
                                    <ActivityIndicator animating={this.state.getIndicator} size="large" color="#17316E" />
                                </View>
                        }
                        
                        <Loader loading={this.state.loading} />
                        <View style={ styles.containerInput } >
                            <TextInput keyboardType='numeric' onChangeText={(value) => this.setState({quantity: value})} style={ styles.inputTokens } value={this.state.quantity} placeholder='Enter quantity Taxi Coins '  />
                        </View>
                        <View style={ styles.widthCon }>
                            <TouchableOpacity onPress={this.buyTokensFunc.bind(this)} style={ styles.containerBuyTokens }>
                                <Text style={ styles.buyTokens }>Buy TC</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{marginTop: 15}}>
                            <Text style={this.state.message === 'Operation is successful' ? styles.greenColor : styles.redColor}>{this.state.message}</Text>
                        </View>
                    </View>
                    <View style={ styles.containerWhiteBack }>
                        <Image source={Ethereum} style={ styles.imgTXC } />
                        <View style={ styles.containerETH }>
                            <Text> Name: {this.state.ETH.name}</Text>
                            <Text> Symbol: {this.state.ETH.symbol}</Text>
                            <Text> Total supply: {this.state.ETH.total_supply}</Text>
                            <Text style={ styles.fontWeight }> Price(USD): { parseFloat(this.state.ETH.price_usd).toFixed(3)}</Text>
                            <Text style={ styles.fontWeight }> Price(BTC): { parseFloat(this.state.ETH.price_btc).toFixed(3)}</Text>
                            <Text> Percent change 1h: {this.state.ETH.percent_change_1h}%</Text>
                            <Text> Percent change 24h: {this.state.ETH.percent_change_1h}%</Text>
                            <Text> Percent change 7d: {this.state.ETH.percent_change_7d}%</Text>
                        </View>
                        
                    </View>
                    <View style={ styles.containerTXC }>
                        <Image source={LogoTC} style={ styles.imgTXC } />
                        <View style={ styles.TXC }>
                            <Text> Name: Taxi Coin</Text>
                            <Text> Symbol: TXC</Text>
                            <Text style={ styles.fontWeight }> Price(USD): { parseFloat(this.state.ETH.price_usd/1000).toFixed(3)}</Text>
                            <Text style={ styles.fontWeight }> Price(BTC): { parseFloat(this.state.ETH.price_btc/1000).toFixed(6)}</Text>
                            <Text> Percent change 1h: {this.state.ETH.percent_change_1h}%</Text>
                            <Text> Percent change 24h: {this.state.ETH.percent_change_1h}%</Text>
                            <Text> Percent change 7d: {this.state.ETH.percent_change_7d}%</Text>
                        </View>
                        
                    </View>
                </ScrollView>
            </View>
          );
      }
  }
  export default BuyTokens;