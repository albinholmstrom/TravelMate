/*
  First time implementing a swipeable full-screen gallery.
  I used ChatGPT for assistance with this section, since I didn’t have
  previous projects or codebases to refer back to for this feature.
*/

// /components/FullScreenGallery.jsx
import React, { useRef, useState, useEffect } from "react";
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

  // Jump to the selected image when the modal opens
  useEffect(() => {
    if (listRef.current && startIndex > 0) {
      // scrollToIndex requires getItemLayout → see below
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
        {/* Close button */}
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

        {/* Swipeable gallery */}
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

        {/* Pager indicator */}
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
