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
      device_id: "",
      device_type: "Device not found",
      to_render: ["Status: Please enter a device ID"],
      scheduled_function: null,
    };
  }
  async retrieve_data(){
    if(this.state.device_id == ""){
      this.setState({
        device_type: "Device not found",
        to_render: ["Status: Please enter a device ID"]
      });
      return;
    }
    if (this.state.scheduled_function != null){
      clearInterval(this.state.scheduled_function);
    }
    let func = () => {rtdb.onValue(rtdb.ref(db, this.state.device_id), (snapshot) => {
      try{
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
      } catch (e){
        this.setState({
          device_type: "Device not found",
          to_render: ["Status: Device not found"]
        });
      }
    })};
    this.setState({
      scheduled_function: setInterval(func, 1000)
    })
  }
  render(){
    return (
      <View style={styles.container}>
        <TextInput style={styles.textinput} placeholder="Device ID" onChangeText={(text) => {if(text != ""){this.setState({device_id: text})}}}/>
        <TouchableOpacity style={styles.retrieve_data_button} onPress={() => this.retrieve_data()}>
          <Text style={styles.retrieve_data_button_text}>Retrieve Data</Text>
        </TouchableOpacity>
        <Text style={styles.flatlist_head}>Retrieved data:</Text>
        <FlatList
          style={styles.flatlist}
          data={this.state.to_render}
          renderItem={({item}) => <Text style={styles.flatlist_item}>{item}</Text>}
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
  textinput: {
    height: 32,
    width: "80%",
    borderColor: 'gray',
    borderWidth: 1,
    marginTop:100,
    paddingLeft: 32,
    paddingRight: 32,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  retrieve_data_button: {
    backgroundColor: 'blue',
    color: 'white',
    padding: 10,
    borderRadius: 5,
    marginTop: 10
  },
  retrieve_data_button_text: {
    color: 'white'
  },
  flatlist_item: {
    padding: 10,
    fontSize: 18,
    height: 44,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
  },
  flatlist: {
    marginTop:100,
    width: "96%",
    height: "50%",
  }
});
