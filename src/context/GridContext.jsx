/**
 * Grid Context
 * Manages master grid state and active segments across the application
 */

import React, { createContext } from "react";

export const GridContext = createContext();

export function GridContextProvider({ children, value }) {
  return <GridContext.Provider value={value}>{children}</GridContext.Provider>;
}

export default GridContext;
