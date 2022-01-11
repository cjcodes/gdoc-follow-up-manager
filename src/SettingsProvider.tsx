import React, { useState } from 'react';
import dayjs from 'dayjs';
import { INPUT_DATE_FORMAT } from './constants';

export type SettingsObject = {
  startDate: string;
  excludeRepliedComments: boolean;
};

export type SettingsContextType = {
  settings: SettingsObject;
  updateSettings: (settings: SettingsObject) => void;
};

const initialState = {
  startDate: dayjs().subtract(6, 'month').format(INPUT_DATE_FORMAT),
  excludeRepliedComments: false,
};

const savedState =
  localStorage.getItem('settings') !== null
    ? {
        ...initialState,
        ...JSON.parse(localStorage.getItem('settings')!),
      }
    : initialState;

export const SettingsContext = React.createContext<SettingsContextType>({
  settings: savedState,
  updateSettings: () => {},
});

const SettingsProvider: React.FC<{}> = function ({ children }) {
  const [state, setState] = useState(savedState);

  const updateSettings = (settings: SettingsObject) => {
    setState(settings);
    localStorage.setItem('settings', JSON.stringify(settings));
  };

  return (
    <SettingsContext.Provider
      value={{
        settings: state,
        updateSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsProvider;
