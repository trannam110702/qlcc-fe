import React, { createContext, useState, useReducer } from "react";

export const StoreContext = createContext();
function reducer(state, action) {
  if (action.type === "set_user_data") {
    return action.payload;
  }
  throw Error("Unknown action.");
}
const StoreProvider = ({ children }) => {
  const [globalState, dispatch] = useReducer(reducer, {});
  return (
    <StoreContext.Provider value={{ globalState, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreProvider;
