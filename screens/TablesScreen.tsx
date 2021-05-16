import * as React from "react";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
var Parse = require("parse/react-native");
import PostComponent from "../components/PostComponent";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Platform,
  Switch
} from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { View } from "../components/Themed";
import { Ionicons } from "@expo/vector-icons"
import Modal from 'react-native-modalbox'
import DateTimePicker from '@react-native-community/datetimepicker'
import moment from "moment";

type props = { value: string; navigation: any };
type state = {
  restaurantListOrigin: any;
  hasLocationPermissions: boolean;
  latitude: number;
  longitude: number;
  restaurantList: any;
  searchValue: string;
  day: any;
  dayEnd: any;
  hour: any;
  hourEnd: any;
  showDate: Boolean;
  showDateEnd: Boolean;
  showHour: Boolean;
  showHourEnd: Boolean;
  isHourBetween: Boolean;
  isDayBetween: Boolean;
};
export default class TablesScreen extends React.Component<props, state> {
  restaurantListCast: any[] = [];
  constructor(props: any) {
    super(props);
    this.state = {
      hasLocationPermissions: false,
      latitude: 0,
      longitude: 0,
      restaurantList: this.restaurantListCast,
      restaurantListOrigin: this.restaurantListCast,
      searchValue: "",
      day: '',
      dayEnd: '',
      hour: '',
      hourEnd: '',
      isHourBetween: false,
      isDayBetween: false,
      showDate: Platform.OS === 'ios',
      showHour: Platform.OS === 'ios',
      showDateEnd: Platform.OS === 'ios',
      showHourEnd: Platform.OS === 'ios'
    };
  }

  async componentDidMount() {
    //  this.getLocationAsync();
    this.getIntcusts();
  }

  async getIntcusts() {
    await Parse.Cloud.run("getIntcustsDiscover")
      .then((response: any) => {
        this.setState({
          restaurantList: response,
          restaurantListOrigin: response,
        });
      })
      .catch((error: any) => console.log(error));
  }

  async onChangeSearch(event: any) {
    //   const {eventCount, target, text} = event.nativeEvent;

    if (
      event == "" ||
      this.state.restaurantList.filter((resto: any) =>
        resto.attributes.corporation.toLowerCase().includes(event.toLowerCase())
      ).length == 0
    ) {
      this.setState({
        restaurantList: this.state.restaurantListOrigin,
      });
    } else {
      this.setState({
        searchValue: event,
      });
      this.setState({
        restaurantList: this.state.restaurantList.filter((resto: any) =>
          resto.attributes.corporation
            .toLowerCase()
            .includes(event.toLowerCase())
        ),
      });
      this.state.restaurantList.filter(
        (resto: any) => resto.corporation == event
      );
    }
  }

  async getLocationAsync() {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status === "granted") {
      let location = await Location.getCurrentPositionAsync({});
      this.setState({
        hasLocationPermissions: true,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } else {
      alert("Location permission not granted");
    }
  }

  render() {
    //  const { search } = this.state.searchValue;
    const { hour, hourEnd, day, dayEnd, showDate, showDateEnd, showHour, showHourEnd, isHourBetween, isDayBetween } = this.state

    return (
      <View style={styles.container}>
        <Modal style={[styles.modal, styles.shadow, {height: isHourBetween && isDayBetween? 230 : (isHourBetween || isDayBetween)? 180 : 120 }]} backdrop={false}  position={"top"} entry="top" ref={'modal'}>
          <View  style={styles.modalHeader}>
            <Ionicons name="close" style={styles.modalCloseIcon} color='red' size={20} onPress={() => this.refs.modal.close()}/>
            <Text style={styles.modalHeaderText}>Filtre</Text>
          </View>
          <View style={styles.modalBody}>
            <View style={styles.datetimeContainer}>
              <View>
                <TouchableOpacity onPress={() => !isDayBetween && this.setState({showDate: true})}>
                  <Text style={styles.datetimeLabel}>Date</Text>
                </TouchableOpacity>
              </View>
              {day !== '' && !isDayBetween &&
                <>
                  <Text style={styles.datetimeText}>{moment.tz(day, 'America/Martinique').format('DD/MM/YYYY')}</Text>
                  <Ionicons name='close' size={20} onPress={() => this.setState({day: ''})}/>
                </>
              }
              <Switch value={isDayBetween} onValueChange={(isDayBetween) => this.setState({isDayBetween})} style={{position:'absolute', right: 0}}/>
            </View>
            {
              isDayBetween &&
              <View style={{paddingHorizontal: 10}}>
                  <View style={styles.datetimeContainer}>
                    <View>
                      <TouchableOpacity onPress={() => this.setState({showDate: true})}>
                        <Text style={styles.datetimeLabel}>Date début</Text>
                      </TouchableOpacity>
                    </View>
                    {day !== '' &&
                      <>
                        <Text style={styles.datetimeText}>{moment.tz(day, 'America/Martinique').format('DD/MM/YYYY')}</Text>
                        <Ionicons name='close' size={20} onPress={() => this.setState({day: ''})}/>
                      </>
                    }
                  </View>
                  <View style={styles.datetimeContainer}>
                    <View>
                      <TouchableOpacity onPress={() => this.setState({showDateEnd: true})}>
                        <Text style={styles.datetimeLabel}>Date fin</Text>
                      </TouchableOpacity>
                    </View>
                    {dayEnd !== '' &&
                      <>
                        <Text style={styles.datetimeText}>{moment.tz(dayEnd, 'America/Martinique').format('DD/MM/YYYY')}</Text>
                        <Ionicons name='close' size={20} onPress={() => this.setState({dayEnd: ''})}/>
                      </>
                    }
                  </View>
              </View>
            }
            {
              (showDate || showDateEnd) &&
              <DateTimePicker
                value={day === ''? moment.tz('America/Martinique').toDate() : moment.tz(day, 'America/Martinique').toDate()}
                mode="date"
                minimumDate={showDateEnd? moment.tz(day, 'America/Martinique').toDate() : moment.tz('America/Martinique').toDate()}
                onChange={(event, selectedDate) => showDate? this.setState({day: moment.tz(selectedDate, 'America/Martinique').toDate(), showDate: Platform.OS !== 'ios'? false : true}) : this.setState({dayEnd: moment.tz(selectedDate, 'America/Martinique').toDate(), showDateEnd: Platform.OS !== 'ios'? false : true})}
              />
            }
            <View style={styles.datetimeContainer}>
              <View>
                <TouchableOpacity onPress={() => !isHourBetween && this.setState({showHour: true})}>
                  <Text style={styles.datetimeLabel}>Heure</Text>
                </TouchableOpacity>
              </View>
              {hour !== '' && !isHourBetween &&
                <>
                  <Text style={styles.datetimeText}>{moment.tz(hour, 'America/Martinique').format('HH:MM')}</Text>
                  <Ionicons name='close' size={20} onPress={() => this.setState({hour: ''})}/>
                </>
              }
              <Switch value={isHourBetween} onValueChange={(isHourBetween) => this.setState({isHourBetween})} style={{position:'absolute', right: 0}}/>
            </View>
            {
              isHourBetween &&
              <View style={{paddingHorizontal: 10}}>
                  <View style={styles.datetimeContainer}>
                    <View>
                      <TouchableOpacity onPress={() => this.setState({showHour: true})}>
                        <Text style={styles.datetimeLabel}>Heure début</Text>
                      </TouchableOpacity>
                    </View>
                    {hour !== '' &&
                      <>
                        <Text style={styles.datetimeText}>{moment.tz(hour, 'America/Martinique').format('HH:MM')}</Text>
                        <Ionicons name='close' size={20} onPress={() => this.setState({hour: ''})}/>
                      </>
                    }
                  </View>
                  <View style={styles.datetimeContainer}>
                    <View>
                      <TouchableOpacity onPress={() => this.setState({showHourEnd: true})}>
                        <Text style={styles.datetimeLabel}>Heure fin</Text>
                      </TouchableOpacity>
                    </View>
                    {hourEnd !== '' &&
                      <>
                        <Text style={styles.datetimeText}>{moment.tz(hourEnd, 'America/Martinique').format('HH:MM')}</Text>
                        <Ionicons name='close' size={20} onPress={() => this.setState({hourEnd: ''})}/>
                      </>
                    }
                  </View>
              </View>
            }
            {
              (showHour || showHourEnd) &&
              <DateTimePicker
                value={hour === ''? moment.tz('America/Martinique').toDate() : hour}
                mode="time"
                minimumDate={showHourEnd? moment.tz(hour, 'America/Martinique').toDate() : moment.tz('America/Martinique').toDate()}
                is24Hour={true}
                onChange={(event, selectedDate) => showHour? this.setState({hour: selectedDate, showHour: Platform.OS !== 'ios'? false : true}) : this.setState({hourEnd: selectedDate, showHourEnd: Platform.OS !== 'ios'? false : true})}
              />
            }
          </View>
        </Modal>
        <View style={styles.searchContainer}>
          <View style={styles.searchHeader}>
            <Ionicons name="search" style={styles.searchIcon}/>
            <TextInput
              placeholder="Rechercher un restaurant"
              style={styles.searchInput}
              defaultValue={this.state.searchValue}
              onChangeText={(value) => this.onChangeSearch(value)}

              //   onChangeText={this.filterResultsSearch}
            ></TextInput>
          </View>
          <View style={styles.searchFilterIcon}>
            <TouchableOpacity onPress={() => this.refs.modal.open()}>
              <Ionicons name="options" size={25} color='#ff5050' />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.container2}>
          {!this.state.restaurantList ||
            (this.state.restaurantList.length == 0 && (
              <View style={styles.wrapindicator}>
                <ActivityIndicator size="large" color="#F50F50" />
              </View>
            ))}
          <FlatList
            style={styles.FlatList}
            data={this.state.restaurantList}
            renderItem={({ item }) => (
              <TouchableWithoutFeedback
                onPress={() => {
                  this.props.navigation.navigate("RestoScreen", {
                    text: "Hello!",
                    restoId: item.id,
                  });
                }}
              >
                {item.attributes.frontpic && (
                  <PostComponent
                    imgUrl={item.attributes.frontpic._url}
                    corponame={item.attributes.corporation}
                    city={item.attributes.cityvenue}
                    StyleK={item.attributes.style}
                    style={styles.postComponent}
                  ></PostComponent>
                )}
              </TouchableWithoutFeedback>
            )}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",

    // alignItems: 'left',
    //justifyContent: 'center',
    //   backgroundColor: "rgba(255,255,255,1)"
  },
  container2: {
    // flex: 1,
    width: "100%",
    //marginTop:40,
    // alignItems: 'left',
    //justifyContent: 'center',
    //   backgroundColor: "rgba(255,255,255,1)"
  },
  wrapindicator: {
    alignItems: "center",
    height: "70%",
    justifyContent: "center",
  },
  FlatList: {
    width: "100%",
    marginLeft: 20,
    marginRight: 20,

    // justifyContent: "flex-start",
    // justifyContent: 'center',
    //  backgroundColor: "rgba(255,255,255,1)"
  },
  modal: {
    top: 100,
    right: -80,
    width: 230,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  },
  modalHeader: {
    flexDirection:'row-reverse',
    justifyContent:'space-between',
    alignItems:'center',
    width:'100%',
    borderRadius: 10,
    padding: 10,
    borderBottomColor: 'rgba(0,0,0,0.3)',
    borderBottomWidth: 1
  },
  modalHeaderText: {
    fontSize: 14,
    fontWeight:'bold',
    color:'green'
  },
  modalCloseIcon: {
    width: 25
  },
  modalBody: {
    flex: 1,
    width:'100%',
    padding: 10,
    borderRadius: 10,
    justifyContent:'flex-start'
  },
  postComponent: {
    height: 120,
    width: "100%",
    //  alignSelf: "stretch",
    //  backgroundColor: "rgba(255,255,255,1)"
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    justifyContent:'space-around'
  },
  searchHeader: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    borderRadius: 10,
    width: "83%",
    marginTop: 60,
    backgroundColor: "#f4f4f4",
    color: "black",
    marginBottom: 10,
    alignSelf: "baseline",
  },
  searchIcon: {
    color: "grey",
    fontSize: 20,
    marginLeft: 5,
    marginRight: 1,
  },
  searchFilterIcon: {
    width: 30,
    alignSelf: "baseline",
  },
  searchInput: {
    width: 239,
    height: 40,
    color: "#000",
    marginRight: 1,
    marginLeft: 5,
    fontSize: 14,
    fontFamily: "geometria-regular",
  },
  datetimeContainer: {
    flexDirection:'row', alignItems:'center', justifyContent:'space-between'
  },
  datetimeText: {
    backgroundColor:'grey', textAlign:'center', width: 90, paddingHorizontal: 5, color:'white', alignSelf:'center', marginHorizontal: 5, borderRadius: 5
  },
  datetimeLabel: {
    fontSize: 14, width: 80, marginVertical: 5, fontWeight:'bold'
  },
  postSection: {
    flex: 1,
    marginTop: 23,
  },
  postSection_contentContainerStyle: {
    height: 600,
    justifyContent: "flex-start",
  },
  rect: {
    top: 4,
    //   left: 4,
    width: 352,
    height: 107,
    position: "absolute",
    backgroundColor: "#E6E6E6",
    borderRadius: 25,
  },
  shadow: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2
  },
  bigTitle: {
    fontFamily: "geometria-regular",
    height: 60,
    width: "83%",
    fontSize: 16,
    marginTop: 20,
    marginBottom: 0,
    marginLeft: "auto",
    marginRight: "auto",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  item: {
    // padding: 10,
    fontSize: 18,
    height: 44,
  },
});
