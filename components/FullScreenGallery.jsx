/*
  Första gången jag arbetar med ett svepbart galleri. Därför användes mycket ChatGPT till denna sektion av kod, då jag inte kunde gå tillbaks
  till tidigare erfarenheter eller exempelprojekt.
*/

// /components/FullScreenGallery.jsx
import React, { useRef, useState } from "react";
import {
  Modal,
  View,
  Image,
  Dimensions,
  FlatList,
  Pressable,
  Text,
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function FullScreenGallery({
  photos = [],
  startIndex = 0,
  onClose,
}) {
  const listRef = useRef(null);
  const [index, setIndex] = useState(startIndex);

  // Hoppa till startIndex när modalen öppnas
  React.useEffect(() => {
    if (listRef.current && startIndex > 0) {
      // scrollToIndex kräver getItemLayout → se nedan
      setTimeout(() => {
        try {
          listRef.current.scrollToIndex({ index: startIndex, animated: false });
        } catch {}
      }, 0);
    }
  }, [startIndex]);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems?.length > 0 && viewableItems[0]?.index != null) {
      setIndex(viewableItems[0].index);
    }
  }).current;

  return (
    <Modal visible animationType="fade" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: "black" }}>
        {/* Stäng-knapp */}
        <Pressable
          onPress={onClose}
          style={{
            position: "absolute",
            top: 40,
            right: 20,
            zIndex: 10,
            padding: 8,
          }}
        >
          <Text style={{ color: "white", fontSize: 28 }}>✕</Text>
        </Pressable>

        {/* Svepbar lista */}
        <FlatList
          ref={listRef}
          data={photos}
          keyExtractor={(item) => item.uri}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          initialScrollIndex={startIndex}
          getItemLayout={(_, i) => ({
            length: width,
            offset: width * i,
            index: i,
          })}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{ itemVisiblePercentThreshold: 60 }}
          renderItem={({ item }) => (
            <View
              style={{
                width,
                height,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                source={{ uri: item.uri }}
                style={{ width, height, resizeMode: "contain" }}
              />
            </View>
          )}
        />

        {/* Pager-text */}
        <View
          style={{
            position: "absolute",
            bottom: 24,
            alignSelf: "center",
            backgroundColor: "rgba(0,0,0,0.4)",
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 12,
          }}
        >
          <Text style={{ color: "white", fontSize: 16 }}>
            {photos.length ? index + 1 : 0} / {photos.length}
          </Text>
        </View>
      </View>
    </Modal>
  );
}
