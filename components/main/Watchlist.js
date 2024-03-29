import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  FlatList,
  Modal,
  TouchableOpacity,
} from "react-native";

import { SearchBar } from "react-native-elements";
import { getAllDataMethod } from "../../all_scripts/getAllData.js";
import { saveAllData } from "../../all_scripts/saveData.js";
//import { getAllStockData } from "../../all_scripts/newStockData.js";
GLOBAL = require("../GlobalState.js");

export default function Watchlist() {
  const [stockDictionary, setStockDictionary] = useState(null);
  const [stockUserArray, setStockUserArray] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);
  const [modalVisible, setModalVisable] = useState(false);
  const [loadedArray, setLoadedArray] = useState(false);
  //const [stockDictonary, setStockDictionary] = useState([]);
  //let stockUserObject = getMyData();

  useEffect(() => {
    //getAllStockData();
    async function getMyData() {
      //await getAllStockData();
      let userData = await getAllDataMethod(GLOBAL.USERNAME);
      //console.log("stock dictionary is : " + stockDictionary["aapl"]["prices"]["one"]);
      setStockUserArray(userData.followed);
      //console.log(userData);
      setStockDictionary(userData.stocks);
      //console.log("inside getMyData " + userData.followed);
      //console.log("inside get my Data2 " + userData.stocks);
      //alert(JSON.stringify(stockDictionary));
      //console.log(stockDictionary);
      
    }
    //console.log("loaded? " + loadedArray);
    if ((stockDictionary === null) || (loadedArray === false)) {
      //console.log("call to database");
      //anytime edits are made we need to setLoadedArray(false) to ensure a reload of the correct elements
      getMyData();
      setLoadedArray(true);
    }
    //setStockUserObject(getMyData().followed)
    fetch("https://api.npoint.io/071d7585a3ce3997e152")
      .then((response) => response.json())
      .then((responseJson) => {
        setFilteredDataSource(responseJson);
        setMasterDataSource(responseJson);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  //console.log(Array.isArray(stockUserArray));
  //console.log("stock dictionary is : " + stockDictionary);
  //console.log(JSON.stringify(stockDictionary));
  const searchFilterFunction = (text) => {
    if (text) {
      setModalVisable(true);
      const newData = masterDataSource.filter(function (item) {
        const itemData = item.title
          ? item.title.toUpperCase()
          : "".toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredDataSource(newData);
      setSearch(text);
    } else {
      setFilteredDataSource(masterDataSource);
      setSearch(text);
    }
  };

  const ItemView = ({ item }) => {
    return (
      <Text style={styles.itemStyle} onPress={() => getItem(item)}>
        {item.id}
        {"."}
        {item.title.toUpperCase()}
      </Text>
    );
  };

  const ItemSeparatorView = () => {
    return (
      <View
        style={{
          height: 1,
          width: 500,
          backgroundColor: "#C8C8C8",
        }}
      />
    );
  };
  const getItem = (item) => {
    if (stockUserArray.includes(item.title.toLowerCase())) {
      alert("That stock is already in your watchlist");
    } else {
      var newArray = [...stockUserArray, item.title.toLowerCase()];
      console.log(newArray);
      setStockUserArray(newArray);
      saveAllData(GLOBAL.USERNAME, newArray); // this might be working completely
      alert(item.title + " has been added to your watchlist");
    }
  };
  // this is a copy of line 72
  const ItemView_2 = ({ item }) => {
    // we must do a long press for it to delete
    return (
      //console.log("item is : " + stockDictionary[stockUserArray[item]]), 
      //{stockDictionary[stockUserArray[item]]["prices"]["one"]}
   // {stockDictionary === null ? 'null? ' : stockDictionary[stockUserArray[item]]["prices"]["one"]}
      //{item.title.toUpperCase()}
      <Text style={styles.info} onLongPress={() => getItem_2(item)}>
        {stockUserArray[item]}
        {" :  "}
        {stockDictionary === null ? 'null? ' : stockDictionary[stockUserArray[item]]["prices"]["one"]}
      </Text>
    );
  };

  const ItemSeparatorView_2 = () => {
    return (
      <View
        style={{
          height: 1,
          width: 500,
          backgroundColor: "#C8C8C8",
        }}
      />
    );
  };
  const getItem_2 = (item) => {
    // this will delete from the added watchlist
    var newArray = [...stockUserArray];
    for (var i = 0; i < newArray.length; i++) {
      if (newArray[i] === newArray[item]) {
        // this finds and deletes the item from the list
        alert(newArray[i] + " has been deleted from your watchlist");
        newArray.splice(i, 1);
      }
    }
    setStockUserArray(newArray);
    saveAllData(GLOBAL.USERNAME, newArray);// we havent placed this just yet.
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.searchBtn}
          onPress={() => setModalVisable(!modalVisible)}
        >
          <Text style={styles.search}>Search</Text>
        </TouchableOpacity>
        <FlatList
          style={styles.infoContainer}
          data={Object.keys(stockUserArray)}
          //renderItem={({ item }) => <Text>{stockUserArray[item]}</Text>}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={ItemSeparatorView_2}
          renderItem={ItemView_2}
          /*data = {filteredDataSource}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={ItemSeparatorView}
          renderItem={ItemView}*/
        />
        <Modal
          animationType="slide"
          //transparent = {true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisable(!modalVisible);
          }}
        >
          <View style={styles.modalView}>
            <SearchBar
              round
              containerStyle={{backgroundColor: 'white'}}
              inputContainerStyle={{backgroundColor: 'white'}}
              inputStyle={{backgroundColor: 'white'}}
              searchIcon={{backgroundColor: 'white', size: 24 }}
              onChangeText={(text) => searchFilterFunction(text)}
              //onClear={(text) => searchFilterFunction('')}
              onClear={(text) => searchFilterFunction("")}
              placeholder="Type Here..."
              value={search}
            />
            <View>
              <FlatList
                /*data = {Object.keys(stockUserArray)}
                // renderItem = {({ item }) => <Text>{stockUserArray[item]}</Text>}*/
                data={filteredDataSource}
                keyExtractor={(item, index) => index.toString()}
                ItemSeparatorComponent={ItemSeparatorView}
                renderItem={ItemView}
              />
            </View>
            <TouchableOpacity
              style={styles.clearBtn}
              onPress={() => setModalVisable(!modalVisible)}
            >
              <Text style={styles.search}>Back</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#212121",
    justifyContent: "center",
    alignItems: "center",
  },
  itemStyle: {
    padding: 10,
  },
  searchBtn: {
    width: "80%",
    backgroundColor: "#2F2F2F",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    marginBottom: 10,
  },
  clearBtn: {
    width: "100%",
    backgroundColor: "#F2A950",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    marginBottom: 10,
  },
  search: {
    color: "#F2F3F7",
  },
  modalView: {
    padding: 10,
    paddingTop: 60,
    backgroundColor: "#fff",
    
  },
  infoContainer: {
    marginTop: 30,
    marginLeft: 10,
    marginRight: 10,
  },
  info: {
    fontSize: 20,
    color: "#EEEEEE",
    marginBottom: 15,
    textTransform: "uppercase",
  },
});
