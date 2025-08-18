import React, { createContext, useContext, useState, useCallback } from 'react';

const DataCollectionContext = createContext();

export const useDataCollection = () => {
  const context = useContext(DataCollectionContext);
  if (!context) {
    throw new Error('useDataCollection must be used within a DataCollectionProvider');
  }
  return context;
};

export const DataCollectionProvider = ({ children }) => {
  const [stationData, setStationData] = useState({
    station4: {
      matchedPairs: [],
      totalPairs: 0,
      completionTime: null,
      startTime: null
    },
    station6: {
      score: 0,
      totalQuestions: 3,
      answers: [],
      completionTime: null
    },
    station7: {
      onboardingExperience: null,
      trainingMotivation: null,
      name: '',
      badgeNumber: '',
      submissionTime: null
    }
  });

  const updateStation4Data = useCallback((data) => {
    setStationData(prev => ({
      ...prev,
      station4: { ...prev.station4, ...data }
    }));
  }, []);

  const updateStation6Data = useCallback((data) => {
    setStationData(prev => ({
      ...prev,
      station6: { ...prev.station6, ...data }
    }));
  }, []);

  const updateStation7Data = useCallback((data) => {
    setStationData(prev => ({
      ...prev,
      station7: { ...prev.station7, ...data }
    }));
  }, []);

  const getAllData = useCallback(() => {
    return {
      ...stationData,
      timestamp: new Date().toISOString(),
      sessionId: Date.now().toString()
    };
  }, [stationData]);

  const resetAllData = useCallback(() => {
    setStationData({
      station4: {
        matchedPairs: [],
        totalPairs: 0,
        completionTime: null,
        startTime: null
      },
      station6: {
        score: 0,
        totalQuestions: 3,
        answers: [],
        completionTime: null
      },
      station7: {
        onboardingExperience: null,
        trainingMotivation: null,
        name: '',
        badgeNumber: '',
        submissionTime: null
      }
    });
  }, []);

  const value = {
    stationData,
    updateStation4Data,
    updateStation6Data,
    updateStation7Data,
    getAllData,
    resetAllData
  };

  return (
    <DataCollectionContext.Provider value={value}>
      {children}
    </DataCollectionContext.Provider>
  );
};
