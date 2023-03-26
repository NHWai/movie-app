import React from "react";

type Props = {
  children: React.ReactNode;
};

type TokenType = {
  tokenStr: string;
  id: string;
  username: string;
  expirationTime: string;
};

type MyContextType = {
  token: TokenType;
  setToken: React.Dispatch<React.SetStateAction<TokenType>>;
};

export const initialToken = {
  tokenStr: "",
  id: "",
  username: "",
  expirationTime: "",
};

export const MyContext = React.createContext<MyContextType>({
  token: initialToken,
  setToken: () => {},
});

export const MyProvider = ({ children }: Props) => {
  let initialStateofToken = initialToken;
  const localToken = localStorage.getItem("jwt");

  //if localstorage has jwt key, check it is expired or not
  if (localToken) {
    const { expirationTime } = JSON.parse(localToken as string);
    const expirationDate = new Date(expirationTime);
    const currentDate = new Date();
    if (expirationDate >= currentDate) {
      initialStateofToken = JSON.parse(localToken as string);
    }
  }

  const [token, setToken] = React.useState<TokenType>(initialStateofToken);

  return (
    <MyContext.Provider value={{ token, setToken }}>
      {children}
    </MyContext.Provider>
  );
};
