'use strict';

import React, {Component} from 'react';
import ReactNative from 'react-native';
const firebase = require('firebase');
const StatusBar = require('./components/statusbar');
const ActionButton = require('./components/actionbutton');
const ListItem = require('./components/listitem');
const styles = require('./styles.js')

const {
  AppRegistry,
  ListView,
  StyleSheet,
	TextInput,
  Text,
  View,
  TouchableHighlight,
  AlertIOS,
} = ReactNative;

const firebaseConfig = {
	 apiKey: "AIzaSyD019MJjVHD0HiCuSA1qeDuQ9sQPeSjI78",
	 authDomain: "watson-68301.firebaseapp.com",
	 databaseURL: "https://watson-68301.firebaseio.com",
	 storageBucket: "watson-68301.appspot.com",
	 messagingSenderId: "469688155988"
 };

const firebaseApp = firebase.initializeApp(firebaseConfig);

class Todo extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
			text: ''
    };
    this.itemsRef = this.getRef().child('items');
  }

  getRef() {
    return firebaseApp.database().ref();
  }

  listenForItems(itemsRef) {
    itemsRef.on('value', (snap) => {
			console.log(snap.val());

      // get children as an array
      var items = [];
      snap.forEach((child) => {
        items.push({
          title: child.val().title,
          _key: child.key
        });
      });

      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(items)
      });

    });
  }

  componentDidMount() {
    this.listenForItems(this.itemsRef);
  }

  render() {
    return (
      <View style={styles.container}>

        <StatusBar title="Priorities" />
				<TextInput
					style={{height: 40}}
					placeholder="type in some stuff"
					onChangeText={(text)=> this.setState({text})}
					/>
				<Text>{this.state.text}</Text>

        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderItem.bind(this)}
          enableEmptySections={true}
          style={styles.listview}/>

        <ActionButton onPress={this._addItem.bind(this)} title="Add" />

      </View>
    )
  }

  _addItem() {
    AlertIOS.prompt(
      'Add New Item',
      null,
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {
          text: 'Add',
          onPress: (text) => {

            this.itemsRef.push({ title: text })
          }
        },
      ],
      'plain-text'
    );
  }

  _renderItem(item) {

    const onPress = () => {
      AlertIOS.alert(
        'Complete',
        null,
        [
          {text: 'Complete', onPress: (text) => this.itemsRef.child(item._key).remove()},
          {text: 'Cancel', onPress: (text) => console.log('Cancelled')}
        ]
      );
    };

    return (
      <ListItem item={item} onPress={onPress} />
    );
  }

}

AppRegistry.registerComponent('Todo', () => Todo);
