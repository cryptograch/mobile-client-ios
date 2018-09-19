import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    AsyncStorage,
} from 'react-native';
import Loader from '../Loader/Loader';
import styles from './style';

  class Messages extends Component {
    static navigationOptions = {
        title: 'My messages'
      }
      constructor(props) {
          super(props);
          this.state = {
              showInfo: false,
              messagesContent: [],
              clientToken: null,
              indexMessage: null,
              loading: true
          }
      }
      tick() {
        fetch(`http://taxi-env.hsgu7qika6.us-east-2.elasticbeanstalk.com/api/accounts/customers/adminresponses`, {
          method: 'GET',
          headers: {
              'Authorization': 'Bearer ' + this.state.clientToken,
          }
        })
        .then((response) => response.json())
        .then((response) => {
          this.setState({
            messagesContent: response,
            loading: false
          });
        });
      }
      async componentDidMount() {
        AsyncStorage.getItem('saveDataUserToken').then((value) => 
        {
          this.setState({clientToken: value})
        });
        this.interval = setInterval( async () => await this.tick(), 5000);
      }
    
      componentWillUnmount() {
        clearInterval(this.interval);
      }
      render() {
          return(
            <View style={styles.container}>
                <View style={ this.state.messagesContent.length >= 6 ? styles.height : null}>
                    <Loader loading={this.state.loading} />
                    <ScrollView>
                        {
                            this.state.messagesContent.length !== 0 ? 
                            this.state.messagesContent.map((item, index) => 
                                <View key={index}>
                                    <TouchableOpacity style={styles.messageStyle}  
                                        onPress={() => this.setState({showInfo: true, indexMessage: index})}>
                                        <Text>From: {item.email}</Text>
                                        <Text>{item.message}</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : 
                            <View style={styles.styleMessageWithout}>
                                <Text style={ styles.styleTextMessage } >You don't have messages!!!</Text>
                            </View>
                            
                        }
                    </ScrollView>
                </View>
                {
                    this.state.showInfo ? 
                    <View style={ styles.messagesContent }>
                        <Text>{this.state.messagesContent[this.state.indexMessage].message}</Text>
                        <Text style={ styles.writeOnEmail }>You can write me on my email: {this.state.messagesContent[this.state.indexMessage].email}</Text>
                    </View> : null
                }
            </View>
          );
      }
  }
  export default Messages;