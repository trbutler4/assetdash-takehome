import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
} from 'react-native';

interface TokenIconProps {
  iconUrl?: string | null;
}

export const TokenIcon: React.FC<TokenIconProps> = ({ iconUrl }) => {
  const [hasError, setHasError] = useState(false);
  
  if (!iconUrl || hasError) {
    return (
      <View style={[styles.tokenIcon, styles.placeholderIcon]}>
        <Text style={styles.placeholderText}>?</Text>
      </View>
    );
  }
  
  return (
    <Image 
      source={{ uri: iconUrl }} 
      style={styles.tokenIcon}
      onError={() => setHasError(true)}
    />
  );
};

const styles = StyleSheet.create({
  tokenIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  placeholderIcon: {
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
  },
});