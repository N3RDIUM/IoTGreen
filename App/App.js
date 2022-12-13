import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, FlatList } from 'react-native';
import firebase from './firebaseConfig';
db = firebase.db;

export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      device_id: "test_bottle",
      device_type: "IoTBottle",
      to_render: []
    };
    this.retrieve_data()
  }
  async retrieve_data(){
    db.ref(this.state.device_id).once('value').then((snapshot) => {
      this.setState({
        device_type: snapshot.val().device_type,
      });
      var keys = Object.keys(snapshot.val());
      var values = Object.values(snapshot.val());
      var to_render = [];
      for (var i = 0; i < keys.length; i++){
        to_render.push(<Text>{keys[i] + ": " + values[i]}</Text>);
      }
    });
  }
  render(){
    return (
      <View style={styles.container}>
        <TextInput placeholder="Device ID" onChangeText={(text) => this.setState({device_id: text})}/>
        <TouchableOpacity onPress={() => this.retrieve_data()}>
          <Text>Retrieve Data</Text>
        </TouchableOpacity>
        <Text>Device ID: {this.state.device_id}</Text>
        <Text>Device Type: {this.state.device_type}</Text>
        <FlatList
          data={this.state.to_render}
          renderItem={({item}) => <Text>{item}</Text>}
        />
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
