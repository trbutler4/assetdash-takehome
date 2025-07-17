import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  SafeAreaView,
  Animated,
  ListRenderItem,
} from 'react-native';
import { SortOption, SortOptionConfig } from '@/types/token';
import { sortOptions, getSortOptionLabel } from '@/utils/sorting';
import { UI_CONFIG } from '@/constants/app';

interface SortPickerProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

/**
 * Animation configuration
 */
const ANIMATION_CONFIG = {
  OVERLAY_DURATION: 200,
  CONTENT_DURATION: 250,
  INITIAL_TRANSLATE_Y: 300,
} as const;

/**
 * Sort picker component with animated modal
 * Allows users to select how the token list should be sorted
 */
export const SortPicker: React.FC<SortPickerProps> = ({
  currentSort,
  onSortChange,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslateY = useRef(new Animated.Value(ANIMATION_CONFIG.INITIAL_TRANSLATE_Y)).current;

  const currentSortLabel = useMemo(() => getSortOptionLabel(currentSort), [currentSort]);

  /**
   * Animate modal visibility changes
   */
  useEffect(() => {
    if (modalVisible) {
      // Animate in
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: ANIMATION_CONFIG.OVERLAY_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(contentTranslateY, {
          toValue: 0,
          duration: ANIMATION_CONFIG.CONTENT_DURATION,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Animate out
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: ANIMATION_CONFIG.OVERLAY_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(contentTranslateY, {
          toValue: ANIMATION_CONFIG.INITIAL_TRANSLATE_Y,
          duration: ANIMATION_CONFIG.CONTENT_DURATION,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [modalVisible, overlayOpacity, contentTranslateY]);

  /**
   * Handle sort option selection
   */
  const handleSortSelect = useCallback((sortOption: SortOption) => {
    onSortChange(sortOption);
    setModalVisible(false);
  }, [onSortChange]);

  /**
   * Toggle modal visibility
   */
  const toggleModal = useCallback(() => {
    setModalVisible(prev => !prev);
  }, []);

  /**
   * Close the modal
   */
  const closeModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  /**
   * Render individual sort option
   */
  const renderSortOption: ListRenderItem<SortOptionConfig> = useCallback(({ item }) => {
    const isActive = currentSort === item.value;
    
    return (
      <TouchableOpacity
        style={[
          styles.sortOption,
          isActive && styles.sortOptionActive,
        ]}
        onPress={() => handleSortSelect(item.value)}
      >
        <Text
          style={[
            styles.sortOptionText,
            isActive && styles.sortOptionTextActive,
          ]}
        >
          {item.label}
        </Text>
        {isActive && (
          <Text style={styles.checkmark}>✓</Text>
        )}
      </TouchableOpacity>
    );
  }, [currentSort, handleSortSelect]);

  /**
   * Render separator between options
   */
  const renderSeparator = useCallback(() => <View style={styles.separator} />, []);

  return (
    <>
      <TouchableOpacity
        style={styles.sortButton}
        onPress={toggleModal}
      >
        <Text style={styles.sortButtonText}>Sort: {currentSortLabel}</Text>
        <Text style={styles.sortButtonIcon}>▼</Text>
      </TouchableOpacity>

      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <Animated.View 
          style={[
            styles.modalOverlay,
            {
              opacity: overlayOpacity,
            }
          ]}
        >
          <TouchableOpacity
            style={StyleSheet.absoluteFillObject}
            activeOpacity={1}
            onPress={closeModal}
          />
          <Animated.View 
            style={[
              styles.modalContent,
              {
                transform: [{ translateY: contentTranslateY }],
              }
            ]}
          >
            <SafeAreaView>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sort By</Text>
              <TouchableOpacity
                onPress={closeModal}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={sortOptions}
              keyExtractor={(item) => item.value}
              renderItem={renderSortOption}
              ItemSeparatorComponent={renderSeparator}
              bounces={false}
            />
            </SafeAreaView>
          </Animated.View>
        </Animated.View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: UI_CONFIG.COLORS.BACKGROUND,
    borderRadius: 20,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  sortButtonText: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
  sortButtonIcon: {
    fontSize: 10,
    color: UI_CONFIG.COLORS.TEXT.SECONDARY,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: UI_CONFIG.COLORS.SURFACE,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: UI_CONFIG.COLORS.BORDER,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 20,
    color: UI_CONFIG.COLORS.TEXT.SECONDARY,
  },
  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sortOptionActive: {
    backgroundColor: `${UI_CONFIG.COLORS.PRIMARY}10`, // 10% opacity
  },
  sortOptionText: {
    fontSize: 16,
    color: UI_CONFIG.COLORS.TEXT.PRIMARY,
  },
  sortOptionTextActive: {
    color: UI_CONFIG.COLORS.PRIMARY,
    fontWeight: '500',
  },
  checkmark: {
    fontSize: 18,
    color: UI_CONFIG.COLORS.PRIMARY,
    fontWeight: '600',
  },
  separator: {
    height: 1,
    backgroundColor: UI_CONFIG.COLORS.BACKGROUND,
    marginHorizontal: 20,
  },
});