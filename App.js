import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, FlatList  } from 'react-native';

import { push, ref, onValue, remove } from 'firebase/database';
import React, { useState, useEffect } from 'react';

import database from './firebase';

import { Header } from '@rneui/themed';
import { Icon } from '@rneui/themed';
import { Input, Button } from '@rneui/themed';
import { ListItem } from '@rneui/themed';
import { ListItemContent } from '@rneui/base/dist/ListItem/ListItem.Content';


export default function App() {

  const [product, setProduct] = useState('');
  const [amount, setAmount] = useState('');
  const [list, setList] = useState([]);

  useEffect(() => {
    const itemsRef = ref(database, 'list/');
    onValue(itemsRef, (snapshot) => {
    const data = snapshot.val();
    //console.log(data)
    const items = data ? Object.keys(data).map(key =>({key, ...data[key]})) : [];
    //console.log(items)
    setList(items);
    })
    }, []);

  const saveItem = () => {
    push(
      ref(database, 'list/'),
      {'product': product, 'amount': amount})
;  }

const deleteItem = (key) => {
  //console.log('deleteItem', key);
  remove(ref(database, 'list/' + key))
};

  const listSeparator = () => {
    return (
      <View
        style={{
          height: 5,
          width: "80%",
          backgroundColor: "#fff",
          marginLeft: "10%"
        }}
      />
    );
  };


  return (
    <View style={styles.container}>
      <Header
      centerComponent={{text: 'SHOPPING LIST', style:{color: '#fff'}}}/>
      <Input placeholder='Product' label='PRODUCT' style={{marginTop: 5, fontSize: 18, width: 200 }}
        onChangeText={(product) => setProduct(product)}
        value={product}/>  
      <Input placeholder='Amount' label='AMOUNT' style={{ marginTop: 5,  fontSize:18, width: 200}}
        onChangeText={(amount) => setAmount(amount)}
        value={amount}/>      
      <Button raised icon={{name: 'save', color:'#fff'}} onPress={saveItem} title="Save"  />
      <Text style={{marginTop: 30, fontSize: 20}}>Shopping list</Text>
      <FlatList 
        //style={{marginLeft : "5%"}}
        data={list}
        keyExtractor={item => item.key} 
        renderItem={({item}) =>(
        <ListItem bottomDivider  >
           <ListItem.Title>{item.product}</ListItem.Title> 
           <ListItem.Subtitle>{item.amount}</ListItem.Subtitle>
           
           <Button buttonStyle={styles.button} type="clear" raised containerStyle={{marginHorizontal:'50'}} icon={{name: 'delete', color:'red'}} onPress={() => deleteItem(item.key)}/>
           </ListItem>)
           
        }
         
         />   
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    //alignItems: 'center',
    justifyContent: 'center',
  },
  listcontainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    //alignItems: 'center'
   },
   button:{
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
   }
});
