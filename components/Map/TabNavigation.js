import { createBottomTabNavigator } from 'react-navigation';

import Map from './Map';
import Profile from './Profile';

export default createBottomTabNavigator({
    Map: { screen: Map, navigationOptions: { header: null } },
    Profile: { screen: Profile },
  });