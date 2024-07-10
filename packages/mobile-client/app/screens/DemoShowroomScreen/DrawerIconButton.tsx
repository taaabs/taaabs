import React from "react"
import { Pressable, PressableProps, ViewStyle } from "react-native"
import Animated, { interpolate, interpolateColor, useAnimatedStyle } from "react-native-reanimated"
import { useDrawerProgress } from "react-native-drawer-layout"
import { isRTL } from "../../i18n"
import { colors, spacing } from "../../theme"

interface DrawerIconButtonProps extends PressableProps {}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

/**
 * @param {DrawerIconButtonProps} props - The props for the `DrawerIconButton` component.
 * @returns {JSX.Element} The rendered `DrawerIconButton` component.
 */
export function DrawerIconButton(props: DrawerIconButtonProps) {
  const { ...PressableProps } = props
  const progress = useDrawerProgress()

  const animatedContainerStyles = useAnimatedStyle(() => {
    const translateX = interpolate(progress.value, [0, 1], [0, isRTL ? 60 : -60])

    return {
      transform: [{ translateX }],
    }
  })

  const animatedTopBarStyles = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(progress.value, [0, 1], [colors.text, colors.tint])
    const marginStart = interpolate(progress.value, [0, 1], [0, -11.5])
    const rotate = interpolate(progress.value, [0, 1], [0, isRTL ? 45 : -45])
    const marginBottom = interpolate(progress.value, [0, 1], [0, -2])
    const width = interpolate(progress.value, [0, 1], [18, 12])

    return {
      backgroundColor,
      marginStart,
      marginBottom,
      width,
      transform: [{ rotate: `${rotate}deg` }],
    }
  })

  const animatedMiddleBarStyles = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(progress.value, [0, 1], [colors.text, colors.tint])
    const width = interpolate(progress.value, [0, 1], [18, 16])

    return {
      backgroundColor,
      width,
    }
  })

  const animatedBottomBarStyles = useAnimatedStyle(() => {
    const marginTop = interpolate(progress.value, [0, 1], [4, 2])
    const backgroundColor = interpolateColor(progress.value, [0, 1], [colors.text, colors.tint])
    const marginStart = interpolate(progress.value, [0, 1], [0, -11.5])
    const rotate = interpolate(progress.value, [0, 1], [0, isRTL ? -45 : 45])
    const width = interpolate(progress.value, [0, 1], [18, 12])

    return {
      backgroundColor,
      marginStart,
      width,
      marginTop,
      transform: [{ rotate: `${rotate}deg` }],
    }
  })

  return (
    <AnimatedPressable {...PressableProps} style={[$container, animatedContainerStyles]}>
      <Animated.View style={[$topBar, animatedTopBarStyles]} />

      <Animated.View style={[$middleBar, animatedMiddleBarStyles]} />

      <Animated.View style={[$bottomBar, animatedBottomBarStyles]} />
    </AnimatedPressable>
  )
}

const barHeight = 2

const $container: ViewStyle = {
  alignItems: "center",
  height: 56,
  justifyContent: "center",
  width: 56,
}

const $topBar: ViewStyle = {
  height: barHeight,
}

const $middleBar: ViewStyle = {
  height: barHeight,
  marginTop: spacing.xxs,
}

const $bottomBar: ViewStyle = {
  height: barHeight,
}
