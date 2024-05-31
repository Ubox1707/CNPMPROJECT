// context/SelectedRoomsContext.js
import React, { createContext, useState } from 'react';

export const SelectedRoomsContext = createContext();

export const SelectedRoomsProvider = ({ children }) => {
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [roomsData, setRoomsData] = useState([]);

  return (
    <SelectedRoomsContext.Provider value={{ selectedRooms, setSelectedRooms, roomsData, setRoomsData }}>
      {children}
    </SelectedRoomsContext.Provider>
  );
};
