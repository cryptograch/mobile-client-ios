import Home from './components/Home/Home';
import {
  StackNavigator,
} from 'react-navigation';
import TabNavigator from './components/Map/TabNavigation';
import Signin from './components/Signin/Signin';
import Settings from './components/Settings/Settings';
import BuyTokens from './components/BuyTokens/BuyTokens';
import Messages from './components/Messages/Messages';
import ChangePurse from './components/Map/ChangePurse';

const SimpleApp = StackNavigator({
  Home: { screen: Home }, 
  Map: { screen:  TabNavigator, navigationOptions: { header: null, gesturesEnabled: false, } },
  Signin: { screen: Signin, navigationOptions: {
    headerTintColor: '#faa71a',
  } },
  Settings: { screen: Settings, navigationOptions: {
    headerTintColor: '#faa71a',
  } },
  BuyTokens: { screen: BuyTokens, navigationOptions: {
    headerTintColor: '#faa71a',
  } },
  Messages: { screen: Messages, navigationOptions: {
    headerTintColor: '#faa71a',
  } },
  ChangePurse: { screen: ChangePurse, navigationOptions: {
    headerTintColor: '#faa71a',
  } }
});

export default SimpleApp;