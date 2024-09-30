import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AnswerContextType {
  answers: { answer1: string | null; answer2: string | null; answer3: string | null };
  updateAnswer: (problem: 'answer1' | 'answer2' | 'answer3', answer: string) => void;
}

const AnswerContext = createContext<AnswerContextType | undefined>(undefined);

export const useAnswers = () => {
  const context = useContext(AnswerContext);
  if (!context) {
    throw new Error('useAnswers must be used within an AnswerProvider');
  }
  return context;
};

interface AnswerProviderProps {
  children: ReactNode;
}

export const AnswerProvider = ({ children }: AnswerProviderProps) => {
  const [answers, setAnswers] = useState({
    answer1: null,
    answer2: null,
    answer3: null,
  });

  const updateAnswer = (problem: 'answer1' | 'answer2' | 'answer3', answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [problem]: answer,
    }));
  };

  return (
    <AnswerContext.Provider value={{ answers, updateAnswer }}>
      {children}
    </AnswerContext.Provider>
  );
};
