import type { ResolvedScene } from './theme';

/**
 * What every effect needs to know. `direction` is 1 when the menu sits on the left (the screen
 * moves right) and -1 when it sits on the right.
 */
export interface EffectFrame {
  width: number;
  panelWidth: number;
  direction: 1 | -1;
}

// Every function below runs on the UI thread inside useAnimatedStyle, hence the 'worklet' marks.
// `progress` goes from 0 (closed) to 1 (open).

/** `overlay`: the screen behind the panel shifts, shrinks and turns in 3D. */
export function overlayScene(progress: number, scene: ResolvedScene | null, frame: EffectFrame) {
  'worklet';
  if (!scene) return {};
  return {
    borderRadius: progress * scene.borderRadius,
    transform: [
      { perspective: 900 },
      { translateX: frame.direction * progress * scene.offset },
      { scale: 1 - progress * (1 - scene.scale) },
      // The edge next to the panel turns away from the viewer and the outer edge comes closer.
      { rotateY: `${-frame.direction * progress * scene.rotate}deg` },
    ],
  };
}

/** `overlay` and `floating`: the panel slides in from its edge. */
export function slideInPanel(progress: number, distance: number, frame: EffectFrame) {
  'worklet';
  return { transform: [{ translateX: -frame.direction * (1 - progress) * distance }] };
}

/**
 * `reveal`: the screen slides 75% of the way and shrinks to 85%, anchored on its edge next to the
 * panel; the panel behind grows from 75% to full size (flutter_advanced_drawer).
 */
export function revealScreen(progress: number, frame: EffectFrame) {
  'worklet';
  return {
    borderRadius: progress * 16,
    transform: [
      { translateX: frame.direction * progress * frame.width * 0.75 },
      { scale: 1 - progress * 0.15 },
    ],
  };
}

export function revealPanel(progress: number) {
  'worklet';
  return { transform: [{ scale: 0.75 + progress * 0.25 }] };
}

/**
 * `cards`: the screen slides, shrinks to 80% and tilts 12° like a card, with two ghost cards
 * behind it tilted a little more (awesome_drawer_bar, `scaleRight` with shadows).
 * `layer` 0 is the screen; 1 and 2 are the ghosts, from front to back.
 */
export function cardsScreen(progress: number, frame: EffectFrame, layer: 0 | 1 | 2) {
  'worklet';
  const scale = layer === 0 ? 1 : layer === 1 ? 0.95 : 0.9;
  const angle = layer === 0 ? 12 : layer === 1 ? 16 : 20;
  const inset = layer * 15;
  return {
    borderRadius: progress * 16,
    // The ghosts hide while closed, so nothing peeks out from behind the screen.
    opacity: layer === 0 ? 1 : Math.min(progress * 4, 1),
    transform: [
      { translateX: frame.direction * progress * (frame.width * 0.83 - inset) },
      { rotateZ: `${-frame.direction * angle * progress}deg` },
      { scale: scale - progress * 0.2 },
    ],
  };
}

/** `flip`: the screen swings 45° away on its outer edge and shrinks to 70% (`rotate3dOut`). */
export function flipScreen(progress: number, frame: EffectFrame) {
  'worklet';
  // The turn happens around the outer edge. transformOrigin together with a perspective is not
  // applied on the New Architecture, so the pivot is moved there and back with translations.
  const pivot = (frame.direction * frame.width) / 2;
  return {
    borderRadius: progress * 16,
    transform: [
      { perspective: 1100 },
      { translateX: frame.direction * progress * frame.width * 0.283 },
      { translateX: pivot },
      { rotateY: `${-frame.direction * progress * 45}deg` },
      { scale: 1 - progress * 0.3 },
      { translateX: -pivot },
    ],
  };
}

/** `push`: the panel slides in and pushes the screen aside by its own width (`stack`). */
export function pushScreen(progress: number, frame: EffectFrame) {
  'worklet';
  return { transform: [{ translateX: frame.direction * progress * frame.panelWidth }] };
}

/** `popup`: the menu fades in while growing from 90% (`popUp`). */
export function popupPanel(progress: number) {
  'worklet';
  return {
    opacity: progress * progress,
    transform: [{ scale: 0.9 + progress * 0.1 }],
  };
}
