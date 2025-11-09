// /components/FullScreenGallery.jsx

//a full-screen modal gallery component that displays a collection of photos.
//supports swipe navigation between images and shows the current image index.

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

  //when opening, jump to the selected image without animation
  // Note: scrollToIndex requires getItemLayout to be defined.
  useEffect(() => {
    if (listRef.current && startIndex > 0) {
      setTimeout(() => {
        try {
          listRef.current.scrollToIndex({ index: startIndex, animated: false });
        } catch {
          //silent ignore if index is out of range
        }
      }, 0);
    }
  }, [startIndex]);

  //track which item is visible to update the pager indicator
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
