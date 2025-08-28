import { createContext, useContext, useState } from "react";

const HeaderContext = createContext();

export const HeaderProvider = ({ children }) => {
  const [showHeader, setShowHeader] = useState(true);

  const hideHeader = () => setShowHeader(false);
  const displayHeader = () => setShowHeader(true);

  return (
    <HeaderContext.Provider value={{
      showHeader,
      hideHeader,
      displayHeader
    }}>
      {children}
    </HeaderContext.Provider>
  );
};

export const useHeader = () => {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error("useHeader must be used within a HeaderProvider");
  }
  return context;
};