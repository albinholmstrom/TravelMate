import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import MapPickerScreen from "./screens/MapPickerScreen";
import TripListScreen from "./screens/TripListScreen";
import TripDetailsScreen from "./screens/TripDetailsScreen";
import AddTripScreen from "./screens/AddTripScreen";
import SettingsScreen from "./screens/SettingsScreen";
import EditTripScreen from "./screens/EditTripScreen";
import { colors, globalStyles } from "./styles/global";

const Tab = createBottomTabNavigator();
const TripsStack = createNativeStackNavigator();
const AddStack = createNativeStackNavigator();

function AddStackNavigator() {
  return (
    <AddStack.Navigator
      screenOptions={{ contentStyle: { backgroundColor: colors.beige } }}
    >
      <AddStack.Screen
        name="AddTrip"
        component={AddTripScreen}
        options={{ title: "New Trip" }}
      />
      <AddStack.Screen
        name="MapPicker"
        component={MapPickerScreen}
        options={{ title: "Select Location" }}
      />
    </AddStack.Navigator>
  );
}

function TripsStackNavigator() {
  return (
    <TripsStack.Navigator
      screenOptions={{ contentStyle: { backgroundColor: colors.beige } }}
    >
      <TripsStack.Screen
        name="TripList"
        component={TripListScreen}
        options={{ title: "Trips" }}
      />
      <TripsStack.Screen
        name="TripDetails"
        component={TripDetailsScreen}
        options={{ title: "Trip Details" }}
      />
      <TripsStack.Screen
        name="EditTrip"
        component={EditTripScreen}
        options={{ title: "Edit Trip" }}
      />
      <TripsStack.Screen
        name="MapPicker"
        component={MapPickerScreen}
        options={{ title: "Select Location" }}
      />
    </TripsStack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <View style={globalStyles.screen}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ focused, size }) => {
              let name = "ellipse";
              if (route.name === "Trips")
                name = focused ? "list" : "list-outline";
              if (route.name === "Add")
                name = focused ? "add-circle" : "add-circle-outline";
              if (route.name === "Settings")
                name = focused ? "settings" : "settings-outline";
              return <Ionicons name={name} size={size} />;
            },
            sceneStyle: { backgroundColor: colors.bg },
            tabBarStyle: { backgroundColor: "#fff" },
          })}
        >
          <Tab.Screen name="Trips" component={TripsStackNavigator} />
          <Tab.Screen name="Add" component={AddStackNavigator} />
          <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
      </View>
    </NavigationContainer>
  );
}
