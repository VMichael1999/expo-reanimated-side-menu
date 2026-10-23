import {
  cardsScreen,
  flipScreen,
  popupPanel,
  pushScreen,
  revealPanel,
  revealScreen,
  slideInPanel,
} from '../effects';

const left = { width: 400, panelWidth: 300, direction: 1 as const };
const right = { ...left, direction: -1 as const };

describe('effects', () => {
  it('leave the screen untouched while closed', () => {
    expect(revealScreen(0, left).transform).toEqual([{ translateX: 0 }, { scale: 1 }]);
    expect(pushScreen(0, left).transform).toEqual([{ translateX: 0 }]);
    expect(cardsScreen(0, left, 0).transform).toEqual([
      { translateX: 0 },
      { rotateZ: '0deg' },
      { scale: 1 },
    ]);
  });

  it('reveal: slides 75% and shrinks to 85%, the panel grows from 75%', () => {
    expect(revealScreen(1, left)).toEqual({
      borderRadius: 16,
      transform: [{ translateX: 300 }, { scale: 0.85 }],
    });
    expect(revealPanel(0).transform).toEqual([{ scale: 0.75 }]);
    expect(revealPanel(1).transform).toEqual([{ scale: 1 }]);
  });

  it('cards: tilts 12° and shrinks to 80%, with ghosts tilted 16° and 20°', () => {
    expect(cardsScreen(1, left, 0).transform).toEqual([
      { translateX: 332 },
      { rotateZ: '-12deg' },
      { scale: 0.8 },
    ]);
    expect(cardsScreen(1, left, 1).transform[1]).toEqual({ rotateZ: '-16deg' });
    expect(cardsScreen(1, left, 2).transform[1]).toEqual({ rotateZ: '-20deg' });
    expect(cardsScreen(0, left, 2).opacity).toBe(0);
  });

  it('mirror everything when the menu is on the right', () => {
    expect(revealScreen(1, right).transform[0]).toEqual({ translateX: -300 });
    expect(cardsScreen(1, right, 0).transform[1]).toEqual({ rotateZ: '12deg' });
    expect(flipScreen(1, right).transform).toContainEqual({ rotateY: '45deg' });
  });

  it('flip: turns 45° and shrinks to 70%', () => {
    const { transform } = flipScreen(1, left);
    expect(transform).toContainEqual({ rotateY: '-45deg' });
    expect(transform).toContainEqual({ scale: 0.7 });
  });

  it('slide the panel in from its edge', () => {
    expect(slideInPanel(0, 300, left).transform).toEqual([{ translateX: -300 }]);
    expect(slideInPanel(1, 300, left).transform).toEqual([{ translateX: -0 }]);
    expect(slideInPanel(0, 300, right).transform).toEqual([{ translateX: 300 }]);
  });

  it('popup: fades in while growing from 90%', () => {
    expect(popupPanel(0)).toEqual({ opacity: 0, transform: [{ scale: 0.9 }] });
    expect(popupPanel(1)).toEqual({ opacity: 1, transform: [{ scale: 1 }] });
  });
});
