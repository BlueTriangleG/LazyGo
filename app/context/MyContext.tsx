import React, { createContext, useContext, useState, ReactNode } from 'react';

// 定义上下文的数据类型
interface MyContextType {
  generating: boolean;
  currentLocation: string;
  setGenerating: (value: boolean) => void;
  setCurrentLocation: (value: string) => void;
}

// 创建上下文
const MyContext = createContext<MyContextType | undefined>(undefined);

// 创建上下文提供者组件
export const MyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [generating, setGenerating] = useState<boolean>(false);
  const [currentLocation, setCurrentLocation] = useState<string>("");

  return (
    <MyContext.Provider value={{ generating, currentLocation, setGenerating, setCurrentLocation }}>
      {children}
    </MyContext.Provider>
  );
};

// 自定义 hook 来使用上下文
export const useMyContext = () => {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error('useMyContext must be used within a MyProvider');
  }
  return context;
};
