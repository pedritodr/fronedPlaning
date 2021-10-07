import { createContext } from "react";

const AuthContext = createContext({
    auth: undefined,
    login: () => null,
    logout: () => null,
    reloadUser: () => null
});

export default AuthContext;