import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { useState } from 'react';
import { Text } from 'react-native';

import { SideMenu } from '../SideMenu';
import type { SideMenuProps } from '../types';

jest.useFakeTimers();

function Harness(props: Partial<SideMenuProps>) {
  const [visible, setVisible] = useState(true);
  return (
    <SideMenu
      visible={visible}
      onClose={() => setVisible(false)}
      profile={{ title: 'My profile', subtitle: '+51 999 999 888' }}
      sections={[
        {
          key: 'main',
          title: 'Navigation',
          items: [{ key: 'trips', label: 'My trips', icon: 'time-outline', onPress: jest.fn() }],
        },
      ]}
      {...props}
    />
  );
}

describe('SideMenu', () => {
  it('shows the profile, the section titles and the items', async () => {
    await render(<Harness />);
    expect(screen.getByText('My profile')).toBeTruthy();
    expect(screen.getByText('+51 999 999 888')).toBeTruthy();
    expect(screen.getByText('Navigation')).toBeTruthy();
    expect(screen.getByText('My trips')).toBeTruthy();
  });

  it('runs the item action only after the menu has closed', async () => {
    const onPress = jest.fn();
    await render(
      <Harness
        sections={[{ key: 'main', items: [{ key: 'trips', label: 'My trips', onPress }] }]}
      />
    );
    await fireEvent.press(screen.getByText('My trips'));
    expect(onPress).not.toHaveBeenCalled();
    await act(async () => {
      jest.runAllTimers();
    });
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('My trips')).toBeNull();
  });

  it('shows the badge, the action, the logout and the footer', async () => {
    await render(
      <Harness
        sections={[
          { key: 'main', items: [{ key: 'inbox', label: 'Inbox', badge: 3, onPress: jest.fn() }] },
        ]}
        action={{ label: 'Delivery mode', icon: 'bag-outline', onPress: jest.fn() }}
        logout={{ onPress: jest.fn() }}
        footerText="Version 1.0.0"
      />
    );
    expect(screen.getByText('3')).toBeTruthy();
    expect(screen.getByText('Delivery mode')).toBeTruthy();
    expect(screen.getByText('Log out')).toBeTruthy();
    expect(screen.getByText('Version 1.0.0')).toBeTruthy();
  });

  it('closes when the backdrop is tapped', async () => {
    const onClose = jest.fn();
    await render(<SideMenu visible onClose={onClose} sections={[]} closeLabel="Close" />);
    await fireEvent.press(screen.getByLabelText('Close'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders the screen it wraps', async () => {
    await render(
      <SideMenu visible={false} onClose={jest.fn()} sections={[]}>
        <Text>Home screen</Text>
      </SideMenu>
    );
    expect(screen.getByText('Home screen')).toBeTruthy();
  });
});
