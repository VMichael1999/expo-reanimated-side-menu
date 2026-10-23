import {
  defaultTheme,
  fontStyle,
  isDarkColor,
  resolveScene,
  resolveTheme,
  resolveWidth,
} from '../theme';

describe('resolveTheme', () => {
  it('returns the default theme without overrides', () => {
    expect(resolveTheme()).toBe(defaultTheme);
  });

  it('keeps the default colors that are not overridden', () => {
    const theme = resolveTheme({ accent: '#00FF00', fonts: { bold: 'Inter-Bold' } });
    expect(theme.accent).toBe('#00FF00');
    expect(theme.background).toBe(defaultTheme.background);
    expect(theme.fonts).toEqual({ bold: 'Inter-Bold' });
  });
});

describe('resolveWidth', () => {
  it('reads widths up to 1 as a fraction of the screen', () => {
    expect(resolveWidth(0.78, 400)).toBe(312);
  });

  it('reads larger widths as points', () => {
    expect(resolveWidth(300, 400)).toBe(300);
  });

  it('never goes past the screen', () => {
    expect(resolveWidth(900, 400)).toBe(400);
  });
});

describe('fontStyle', () => {
  it('uses the custom family when there is one', () => {
    expect(fontStyle('Inter-Bold', '700')).toEqual({ fontFamily: 'Inter-Bold' });
  });

  it('falls back to the system font weight', () => {
    expect(fontStyle(undefined, '700')).toEqual({ fontWeight: '700' });
  });
});

describe('isDarkColor', () => {
  it('tells dark panels from light ones', () => {
    expect(isDarkColor('#111519')).toBe(true);
    expect(isDarkColor('#FFFFFF')).toBe(false);
    expect(isDarkColor('#fff')).toBe(false);
  });

  it('treats colors it cannot read as dark', () => {
    expect(isDarkColor('rgb(255, 255, 255)')).toBe(true);
  });
});

describe('resolveScene', () => {
  it('tilts the screen by default', () => {
    expect(resolveScene(undefined, 312, 400)).toEqual({
      offset: 216,
      scale: 0.86,
      rotate: 9,
      borderRadius: 24,
    });
  });

  it('pushes the screen by the panel width with slide', () => {
    expect(resolveScene({ effect: 'slide' }, 312, 400)).toEqual({
      offset: 312,
      scale: 1,
      rotate: 0,
      borderRadius: 0,
    });
  });

  it('keeps the screen still with none', () => {
    expect(resolveScene({ effect: 'none' }, 312, 400)).toBeNull();
  });

  it('lets each value be overridden', () => {
    expect(resolveScene({ rotate: 0, offset: 100 }, 312, 400)).toMatchObject({
      offset: 100,
      rotate: 0,
      scale: 0.86,
    });
  });
});
