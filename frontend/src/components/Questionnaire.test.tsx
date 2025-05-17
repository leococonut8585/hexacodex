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

jest.mock('../constants/features.json', () => ({
  default: { TEST_CAT: { catch: 'catch', description: 'desc' } }
}));

test('submit disabled until all questions answered', () => {
  const Questionnaire = require('./Questionnaire').default;
  render(<Questionnaire />);
  const submitButton = screen.getByTestId('submit');
  // 未回答のため無効
  expect(submitButton).toBeDisabled();
  const radios = screen.getAllByRole('radio');
  radios.forEach((r) => fireEvent.click(r));
  expect(submitButton).not.toBeDisabled();
  fireEvent.click(submitButton);
  expect(screen.getByTestId('result')).toBeInTheDocument();
});
