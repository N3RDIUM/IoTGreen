import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, FlatList } from 'react-native';
import firebase from './firebaseConfig';
const db = firebase.db;
const rtdb = firebase.rtdb;

export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      device_id: "test_bottle",
      device_type: "IoTBottle",
      to_render: []
    };
  }
  componentDidMount(){
    this.retrieve_data()
  }
  async retrieve_data(){
    rtdb.onValue(rtdb.ref(db, this.state.device_id), (snapshot) => {
      const data = snapshot.val();
      this.setState({
        device_type: data.device_type,
        data: data
      });
      var keys = Object.keys(snapshot.val());
      var values = Object.values(snapshot.val());
      var to_render = [];
      for (var i = 0; i < keys.length; i++){
        to_render.push(keys[i] + ": " + values[i]);
      }
      this.setState({
        to_render: to_render
      });
    });
  }
  render(){
    return (
      <View style={styles.container}>
        <TextInput style={{marginTop:100}} placeholder="Device ID" onChangeText={(text) => this.setState({device_id: text})}/>
        <TouchableOpacity onPress={() => this.retrieve_data()}>
          <Text>Retrieve Data</Text>
        </TouchableOpacity>
        <Text>Device ID: {this.state.device_id}</Text>
        <Text>Device Type: {this.state.device_type}</Text>
        <FlatList
          style={{marginTop:100}}
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
