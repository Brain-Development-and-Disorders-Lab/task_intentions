// Test utilities
import {waitFor, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import {axe, toHaveNoViolations} from 'jest-axe';
import {act} from 'react-dom/test-utils';

// React
import React from 'react';

// Custom wrapper
import {render} from '../../Wrapper';

// Option component
import Option from '@components/Option';

// Extend the 'expect' function
expect.extend(toHaveNoViolations);

test('loads and displays Option component', async () => {
  await waitFor(() => render(
      <Option
        optionKey='test'
        optionName='Option Test'
        pointsParticipant={15}
        pointsPartner={12}
      />
  ));

  await waitFor(() => expect(screen.getByText('+15')).toBeInTheDocument());
  await waitFor(() => expect(screen.getByText('+12')).toBeInTheDocument());
});

test('check Option component accessibility', async () => {
  const {container} = render(
      <Option
        optionKey='test'
        optionName='Option Test'
        pointsParticipant={15}
        pointsPartner={12}
      />
  );

  await act(async () => {
    const results = await axe(container);
    await waitFor(() => expect(results).toHaveNoViolations());
  });
});
