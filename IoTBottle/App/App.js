import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import axios from 'axios';

export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      last_drink: 0,
    };
    setInterval(this.retrieve_data.bind(this), 100);
  }
  async retrieve_data(){
    await fetch('http://192.168.0.103/', {
      method: 'GET',
      headers: {
        'Accept': 'text/html',
        'Content-Type': 'text/html',
      },
    }).then((response) => response.text())
    .then((responseText) => {
      this.setState({last_drink: responseText});
    })
  }
  render(){
    return (
      <View style={styles.container}>
        <Text>{"Last drink: " + this.state.last_drink}</Text>
        <TouchableOpacity onPress={() => this.retrieve_data()}>
          <Text>Retrieve Data</Text>
        </TouchableOpacity>
        <StatusBar style="auto" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
