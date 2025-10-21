import React from "react";
import { View, Image, FlatList, Pressable } from "react-native";
import styles from "../styles/photos";

export default function PhotosGrid({ photos = [], onPressPhoto }) {
  const data = Array.isArray(photos) ? photos : [];

  return (
    <FlatList
      style={styles.grid}
      data={data}
      numColumns={3}
      keyExtractor={(item) => item.uri}
      columnWrapperStyle={styles.row}
      renderItem={({ item }) => (
        <Pressable style={styles.item} onPress={() => onPressPhoto?.(item)}>
          <Image source={{ uri: item.uri }} style={styles.image} />
        </Pressable>
      )}
      ListFooterComponent={<View style={{ height: 4 }} />}
    />
  );
}
