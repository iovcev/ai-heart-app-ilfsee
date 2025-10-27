
import { useRouter, usePathname } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import React from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { IconSymbol } from '@/components/IconSymbol';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/styles/commonStyles';

export interface TabBarItem {
  name: string;
  route: string;
  icon: string;
  label: string;
}

interface FloatingTabBarProps {
  tabs: TabBarItem[];
  containerWidth?: number;
  borderRadius?: number;
  bottomMargin?: number;
}

export default function FloatingTabBar({
  tabs,
  containerWidth = Dimensions.get('window').width - 40,
  borderRadius = 25,
  bottomMargin = 20,
}: FloatingTabBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();

  const activeIndex = tabs.findIndex((tab) => {
    if (tab.route === '/(tabs)/(home)/') {
      return pathname === '/' || pathname.startsWith('/(tabs)/(home)');
    }
    return pathname.includes(tab.name);
  });

  const translateX = useSharedValue(0);

  React.useEffect(() => {
    const tabWidth = containerWidth / tabs.length;
    translateX.value = withSpring(activeIndex * tabWidth, {
      damping: 20,
      stiffness: 90,
    });
  }, [activeIndex, containerWidth, tabs.length, translateX]);

  const indicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const handleTabPress = (route: string) => {
    router.push(route as any);
  };

  const tabWidth = containerWidth / tabs.length;

  return (
    <SafeAreaView
      style={[styles.safeArea, { marginBottom: bottomMargin }]}
      edges={['bottom']}
    >
      <View style={[styles.container, { width: containerWidth }]}>
        <BlurView
          intensity={Platform.OS === 'ios' ? 80 : 0}
          tint={theme.dark ? 'dark' : 'light'}
          style={[
            styles.blurContainer,
            { borderRadius },
            Platform.OS !== 'ios' && {
              backgroundColor: colors.card,
            },
          ]}
        >
          <Animated.View
            style={[
              styles.indicator,
              {
                width: tabWidth - 20,
                borderRadius: borderRadius - 5,
                backgroundColor: colors.primary,
              },
              indicatorStyle,
            ]}
          />

          <View style={styles.tabsContainer}>
            {tabs.map((tab, index) => {
              const isActive = index === activeIndex;

              return (
                <TouchableOpacity
                  key={tab.name}
                  style={[styles.tab, { width: tabWidth }]}
                  onPress={() => handleTabPress(tab.route)}
                  activeOpacity={0.7}
                >
                  <View style={styles.tabContent}>
                    <IconSymbol
                      name={tab.icon as any}
                      size={24}
                      color={isActive ? '#FFFFFF' : colors.text}
                    />
                    <Text
                      style={[
                        styles.label,
                        {
                          color: isActive ? '#FFFFFF' : colors.text,
                        },
                      ]}
                    >
                      {tab.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </BlurView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    pointerEvents: 'box-none',
  },
  container: {
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blurContainer: {
    flex: 1,
    width: '100%',
    overflow: 'hidden',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
    elevation: 8,
  },
  indicator: {
    position: 'absolute',
    height: 50,
    top: 10,
    left: 10,
  },
  tabsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
  },
});
