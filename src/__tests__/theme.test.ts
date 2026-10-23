import { defaultTheme, fontStyle, isDarkColor, resolveTheme, resolveWidth } from '../theme';

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
