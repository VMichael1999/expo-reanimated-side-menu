import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { useState } from 'react';
import { Text } from 'react-native';

import { SideMenu } from '../SideMenu';
import type { SideMenuProps, SideMenuVariant } from '../types';

jest.useFakeTimers();

const VARIANTS: SideMenuVariant[] = [
  'overlay',
  'reveal',
  'cards',
  'flip',
  'push',
  'popup',
  'floating',
  'rail',
];

function Harness(props: Partial<SideMenuProps>) {
  const [visible, setVisible] = useState(true);
  return (
    <SideMenu
      visible={visible}
      onClose={() => setVisible(false)}
      onOpen={() => setVisible(true)}
      sections={[
        {
          key: 'main',
          title: 'Main',
          items: [{ key: 'orders', label: 'Orders', icon: 'receipt-outline', onPress: jest.fn() }],
        },
      ]}
      {...props}>
      <Text>Dashboard</Text>
    </SideMenu>
  );
}

describe.each(VARIANTS)('variant %s', (variant) => {
  it('renders the screen and the menu', async () => {
    await render(<Harness variant={variant} />);
    expect(screen.getByText('Dashboard')).toBeTruthy();
    expect(screen.getByText('Orders')).toBeTruthy();
  });
});

describe('variants', () => {
  it('the rail runs actions right away and stays on screen', async () => {
    const onPress = jest.fn();
    await render(
      <Harness
        variant="rail"
        sections={[{ key: 'main', items: [{ key: 'orders', label: 'Orders', onPress }] }]}
      />
    );
    await fireEvent.press(screen.getByText('Orders'));
    expect(onPress).toHaveBeenCalledTimes(1);
    await act(async () => {
      jest.runAllTimers();
    });
    expect(screen.getByText('Orders')).toBeTruthy();
  });

  it('the compact rail shows icons only', async () => {
    await render(<Harness variant="rail" visible={false} />);
    expect(screen.queryByText('Orders')).toBeNull();
    expect(screen.getByLabelText('Orders')).toBeTruthy();
  });

  it('the popup closes with its button', async () => {
    await render(<Harness variant="popup" closeLabel="Close" />);
    await fireEvent.press(screen.getByLabelText('Close'));
    await act(async () => {
      jest.runAllTimers();
    });
    expect(screen.queryByText('Orders')).toBeNull();
  });

  it('the floating card folds down to icons', async () => {
    await render(<Harness variant="floating" />);
    await fireEvent.press(screen.getByLabelText('Collapse menu'));
    expect(screen.queryByText('Orders')).toBeNull();
    expect(screen.getByLabelText('Expand menu')).toBeTruthy();
  });

  it('tapping the screen closes the variants where the panel waits behind it', async () => {
    await render(<Harness variant="reveal" closeLabel="Close" />);
    await fireEvent.press(screen.getByLabelText('Close'));
    await act(async () => {
      jest.runAllTimers();
    });
    expect(screen.queryByText('Orders')).toBeNull();
  });

  it('marks the selected item', async () => {
    await render(<Harness selectedKey="orders" />);
    expect(screen.getByLabelText('Orders').props.accessibilityState).toMatchObject({
      selected: true,
    });
  });

  it('leaves the screen usable after switching from the closed rail to another variant', async () => {
    const view = await render(
      <SideMenu variant="rail" visible={false} onClose={jest.fn()} closeLabel="Close">
        <Text>Dashboard</Text>
      </SideMenu>
    );
    await view.rerender(
      <SideMenu variant="reveal" visible={false} onClose={jest.fn()} closeLabel="Close">
        <Text>Dashboard</Text>
      </SideMenu>
    );
    expect(screen.queryByLabelText('Close')).toBeNull();
    expect(screen.queryByText('Orders')).toBeNull();
  });

  it('drops the action of an item when the menu reopens before it finished closing', async () => {
    const onPress = jest.fn();
    const sections = [{ key: 'main', items: [{ key: 'orders', label: 'Orders', onPress }] }];
    function Toggle() {
      const [visible, setVisible] = useState(true);
      return (
        <>
          <SideMenu visible={visible} onClose={() => setVisible(false)} sections={sections} />
          <Text onPress={() => setVisible(true)}>Open</Text>
        </>
      );
    }
    await render(<Toggle />);
    await fireEvent.press(screen.getByText('Orders'));
    await fireEvent.press(screen.getByText('Open'));
    await act(async () => {
      jest.runAllTimers();
    });
    expect(onPress).not.toHaveBeenCalled();
  });

  it('keeps the floating card toggle at the foot when the order leaves out the sections', async () => {
    await render(<Harness variant="floating" order={['header']} header={<Text>Logo</Text>} />);
    expect(screen.getByLabelText('Collapse menu')).toBeTruthy();
  });
});
