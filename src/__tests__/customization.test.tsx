import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { useState } from 'react';
import { Switch, Text } from 'react-native';

import { SideMenu } from '../SideMenu';
import type { SideMenuProps } from '../types';

jest.useFakeTimers();

const base = { visible: true, onClose: jest.fn() };

function Closable(props: Omit<SideMenuProps, 'visible' | 'onClose'>) {
  const [visible, setVisible] = useState(true);
  return <SideMenu {...props} visible={visible} onClose={() => setVisible(false)} />;
}

describe('customization', () => {
  it('shows only the blocks in `order`, in that order', async () => {
    await render(
      <SideMenu
        {...base}
        order={['footer', 'sections', 'header']}
        header={<Text>Logo</Text>}
        footer={<Text>Help</Text>}
        logout={{ onPress: jest.fn() }}
        footerText="v1"
        sections={[{ key: 'a', items: [{ key: 'home', label: 'Home', onPress: jest.fn() }] }]}
      />
    );
    const texts = screen.getAllByText(/Logo|Help|Home/).map((node) => node.props.children);
    expect(texts).toEqual(['Help', 'Home', 'Logo']);
    expect(screen.queryByText('Log out')).toBeNull();
    expect(screen.queryByText('v1')).toBeNull();
  });

  it('places free content between sections', async () => {
    await render(
      <SideMenu
        {...base}
        sections={[
          { key: 'a', items: [{ key: 'home', label: 'Home', onPress: jest.fn() }] },
          { key: 'promo', content: <Text>Promo banner</Text> },
          { key: 'b', title: 'More', items: [{ key: 'help', label: 'Help', onPress: jest.fn() }] },
        ]}
      />
    );
    const texts = screen.getAllByText(/Home|Promo banner|Help/).map((node) => node.props.children);
    expect(texts).toEqual(['Home', 'Promo banner', 'Help']);
  });

  it('draws subtitles, trailing elements and whole custom rows', async () => {
    const onPress = jest.fn();
    await render(
      <Closable
        selectedKey="custom"
        sections={[
          {
            key: 'a',
            items: [
              { key: 'plan', label: 'Plan', subtitle: 'Pro until May', onPress: jest.fn() },
              {
                key: 'dark',
                label: 'Dark mode',
                trailing: <Switch testID="dark-switch" value />,
              },
              {
                key: 'custom',
                label: 'Custom',
                onPress,
                render: ({ selected }) => <Text>{selected ? 'Custom row on' : 'Custom row'}</Text>,
              },
            ],
          },
        ]}
      />
    );
    expect(screen.getByText('Pro until May')).toBeTruthy();
    expect(screen.getByTestId('dark-switch')).toBeTruthy();
    expect(screen.getByLabelText('Dark mode').props.accessibilityRole).toBeUndefined();
    await fireEvent.press(screen.getByText('Custom row on'));
    await act(async () => {
      jest.runAllTimers();
    });
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('draws only the dividers you list, wherever you list them', async () => {
    await render(
      <SideMenu
        {...base}
        testID="menu"
        order={['divider', 'header', 'sections', 'divider', 'divider', 'logout']}
        header={<Text>Logo</Text>}
        logout={{ onPress: jest.fn() }}
        sections={[{ key: 'a', items: [{ key: 'home', label: 'Home', onPress: jest.fn() }] }]}
      />
    );
    expect(screen.getAllByTestId('side-menu-divider')).toHaveLength(3);
  });

  it('draws no dividers when your order leaves them out', async () => {
    await render(
      <SideMenu
        {...base}
        order={['header', 'sections', 'logout']}
        header={<Text>Logo</Text>}
        logout={{ onPress: jest.fn() }}
        sections={[{ key: 'a', items: [{ key: 'home', label: 'Home', onPress: jest.fn() }] }]}
      />
    );
    expect(screen.queryAllByTestId('side-menu-divider')).toHaveLength(0);
  });

  it('keeps the usual lines without an order of your own', async () => {
    await render(
      <SideMenu
        {...base}
        header={<Text>Logo</Text>}
        logout={{ onPress: jest.fn() }}
        sections={[{ key: 'a', items: [{ key: 'home', label: 'Home', onPress: jest.fn() }] }]}
      />
    );
    expect(screen.getAllByTestId('side-menu-divider')).toHaveLength(2);
  });

  it('puts a line above a section when asked', async () => {
    await render(
      <SideMenu
        {...base}
        order={['sections']}
        sections={[
          { key: 'a', items: [{ key: 'home', label: 'Home', onPress: jest.fn() }] },
          { key: 'b', divider: true, items: [{ key: 'help', label: 'Help', onPress: jest.fn() }] },
        ]}
      />
    );
    expect(screen.getAllByTestId('side-menu-divider')).toHaveLength(1);
  });
});
