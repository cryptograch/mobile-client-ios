import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Modal,
  ActivityIndicator,
  Text
} from 'react-native';
import {
  SkypeIndicator,
} from 'react-native-indicators';

const Loader = props => {
  const { loading, ...attributes } = props;

  return (
    <Modal
      transparent={true}
      animationType={'none'}
      visible={loading === true ? true : false}>
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <SkypeIndicator color="#faa71a" />
          <Text style={styles.marginTop}>Wait please</Text> 
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#00000040'
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: '20%',
    width: 200,
    borderRadius: 15,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  marginTop: {
    top: -25
  }
});

export default Loader;