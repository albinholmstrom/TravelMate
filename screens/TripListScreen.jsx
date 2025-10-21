import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import styles from "../styles/tripList";
import { useTrips } from "../hooks/useTrips";
import { fmtRange } from "../utils/date";

export default function TripListScreen({ navigation }) {
  const { trips, loading } = useTrips();

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator />
        <Text style={styles.centeredText}>Laddar...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={trips}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() =>
              navigation.navigate("TripDetails", { tripId: item.id })
            }
          >
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.dates}>
              {fmtRange(item.dates?.start, item.dates?.end)}
            </Text>
          </Pressable>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>Inga resor ännu.</Text>
          </View>
        }
      />
    </View>
  );
}
