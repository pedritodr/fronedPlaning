import { getToken, hasExpiredToken } from '../pages/api/token';

export function validToken(logout) {
    const token = getToken();
    if (token === null) {
        logout();
    } else {
        if (hasExpiredToken(token)) {
            logout();
        } else {
            return token
        }
    }
}