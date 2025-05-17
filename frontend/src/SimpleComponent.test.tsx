import React from 'react';
import { render, screen } from '@testing-library/react';
import SimpleComponent from './SimpleComponent';

test('renders hello jest', () => {
  render(<SimpleComponent />);
  const divElement = screen.getByText(/Hello Jest/i);
  expect(divElement).toBeInTheDocument();
});