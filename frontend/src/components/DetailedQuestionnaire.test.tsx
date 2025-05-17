import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

jest.mock('../constants/questions.json', () => ({
  default: {
    TEST: [
      { id: 1, question: 'q1?', optionYes: 'はい', optionNo: 'いいえ' },
      { id: 2, question: 'q2?', optionYes: 'はい', optionNo: 'いいえ' }
    ]
  }
}));

jest.mock('../constants/features.json', () => ({
  default: {
    'TEST-1': { catch: 'c1', description: 'd1' },
    'TEST-2': { catch: 'c2', description: 'd2' }
  }
}));

const DetailedQuestionnaire = require('./DetailedQuestionnaire').default;

test('can answer questions and see result', () => {
  render(
    <MemoryRouter initialEntries={["/questions/TEST"]}>
      <Routes>
        <Route path="/questions/:category" element={<DetailedQuestionnaire />} />
      </Routes>
    </MemoryRouter>
  );
  const radios = screen.getAllByRole('radio');
  fireEvent.click(radios[0]); // q1 yes
  fireEvent.click(screen.getByTestId('next'));
  fireEvent.click(screen.getAllByRole('radio')[0]); // q2 yes
  fireEvent.click(screen.getByTestId('finish'));
  expect(screen.getByTestId('final-result')).toBeInTheDocument();
  expect(screen.getByText('TEST-2')).toBeInTheDocument();
});
