import { Image, StyleSheet, View } from 'react-native';

import { AppText } from './AppText';

type RadarLogoProps = {
  size?: number;
  showName?: boolean;
};

export function RadarLogo({ size = 96, showName = true }: RadarLogoProps) {
  return (
    <View style={styles.container} accessible accessibilityLabel="Smart Sampa Zeladoria">
      <Image source={require('@/assets/images/logo.png')} style={{ width: size, height: size }} />
      {showName ? (
        <View style={styles.names}>
          <AppText variant="display" style={styles.wordmark}>
            smart sampa
          </AppText>
          <AppText variant="overline" color="primary">
            ZELADORIA
          </AppText>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 8,
  },
  names: {
    alignItems: 'center',
  },
  wordmark: {
    letterSpacing: -0.5,
  },
});
