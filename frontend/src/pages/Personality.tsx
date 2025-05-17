import React from 'react';
import { useParams } from 'react-router-dom';
import Questionnaire from '../components/Questionnaire';
import DetailedQuestionnaire from '../components/DetailedQuestionnaire';

const Personality = () => {
  const { category } = useParams<{ category?: string }>();
  return (
    <div>
      {category ? <DetailedQuestionnaire /> : <Questionnaire />}
    </div>
  );
};

export default Personality;
