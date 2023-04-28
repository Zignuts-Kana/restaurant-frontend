import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useDisclosure, useToast } from "@chakra-ui/react";
import useLocalStorage from "@/utils";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isHome, setIsHome] = useState(true);
  const [changeNav, setChangeNav] = useState(false);
  const [restId, setRestId] = useState(false);

  return (
    <AuthContext.Provider
      value={{
        isHome,
        setIsHome,
        changeNav,
        restId,
        setRestId,
        setChangeNav,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const dataState = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
