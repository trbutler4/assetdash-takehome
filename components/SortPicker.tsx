import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { SortOption } from '@/types/token';
import { sortOptions } from '@/utils/sorting';

interface SortPickerProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export const SortPicker: React.FC<SortPickerProps> = ({
  currentSort,
  onSortChange,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const currentSortLabel = sortOptions.find(opt => opt.value === currentSort)?.label || 'Sort';

  const handleSortSelect = (sortOption: SortOption) => {
    onSortChange(sortOption);
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.sortButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.sortButtonText}>Sort: {currentSortLabel}</Text>
        <Text style={styles.sortButtonIcon}>▼</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <SafeAreaView style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sort By</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={sortOptions}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.sortOption,
                    currentSort === item.value && styles.sortOptionActive,
                  ]}
                  onPress={() => handleSortSelect(item.value)}
                >
                  <Text
                    style={[
                      styles.sortOptionText,
                      currentSort === item.value && styles.sortOptionTextActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                  {currentSort === item.value && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </SafeAreaView>
        </TouchableOpacity>
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
    backgroundColor: '#F5F5F5',
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
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
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
    color: '#666',
  },
  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sortOptionActive: {
    backgroundColor: '#F0F8FF',
  },
  sortOptionText: {
    fontSize: 16,
    color: '#333',
  },
  sortOptionTextActive: {
    color: '#007AFF',
    fontWeight: '500',
  },
  checkmark: {
    fontSize: 18,
    color: '#007AFF',
    fontWeight: '600',
  },
  separator: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginHorizontal: 20,
  },
});