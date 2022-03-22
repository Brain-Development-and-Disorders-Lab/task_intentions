// Test utilities
import {waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import {axe, toHaveNoViolations} from 'jest-axe';
import {act} from 'react-dom/test-utils';

// React
import React from 'react';

// Custom wrapper
import {render} from '../../Wrapper';
import Character from '@components/Character';

// Extend the 'expect' function
expect.extend(toHaveNoViolations);

test('loads and displays Character component', async () => {
  const {container} = render(
      <Character
        size={128}
        name='a'
        state='a'
        setState={() => {
          return;
        }}
      />
  );

  await waitFor(() =>
    expect(container.querySelector('svg')).toBeInTheDocument());
});

test('check Character accessibility', async () => {
  const {container} = render(
      <Character
        size={128}
        name='a'
        state='a'
        setState={() => {
          return;
        }}
      />
  );

  await act(async () => {
    const results = await axe(container);
    await waitFor(() => expect(results).toHaveNoViolations());
  });
});