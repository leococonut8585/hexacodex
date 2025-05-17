import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// 小規模データで挙動を検証
jest.mock('../constants/questions.json', () => ({
  default: {
    TEST_CAT: [
      { id: 1, question: 'q1?', optionYes: 'はい', optionNo: 'いいえ' },
      { id: 2, question: 'q2?', optionYes: 'はい', optionNo: 'いいえ' }
    ]
  }
}));

jest.mock('../constants/officialFeatures', () => ({
  getInitialFeature: () => ({ catch: 'catch', description: 'desc' })
}));

test('submit disabled until all questions answered', () => {
  const Questionnaire = require('./Questionnaire').default;
  render(<Questionnaire />);

  // 1問目回答
  fireEvent.click(screen.getAllByRole('radio')[0]);
  fireEvent.click(screen.getByTestId('next'));

  // 2問目回答後に結果表示
  const submitButton = screen.getByTestId('submit');
  expect(submitButton).toBeDisabled();
  fireEvent.click(screen.getAllByRole('radio')[0]);
  expect(submitButton).not.toBeDisabled();
  fireEvent.click(submitButton);
  expect(screen.getByTestId('result')).toBeInTheDocument();
});
