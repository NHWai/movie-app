import React from "react";

type Props = {
  children: React.ReactNode;
};

type TokenType = {
  tokenStr: string;
  id: string;
  username: string;
};

type MyContextType = {
  token: TokenType;
  setToken: React.Dispatch<React.SetStateAction<TokenType>>;
};

export const initialToken = {
  tokenStr: "",
  id: "",
  username: "",
};

export const MyContext = React.createContext<MyContextType>({
  token: initialToken,
  setToken: () => {},
});

export const MyProvider = ({ children }: Props) => {
  const [token, setToken] = React.useState<TokenType>(initialToken);

  return (
    <MyContext.Provider value={{ token, setToken }}>
      {children}
    </MyContext.Provider>
  );
};
