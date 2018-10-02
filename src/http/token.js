const token = {};

export const TOKEN_ID = 'OT::jwt';

token.save = token => {
  localStorage.setItem(TOKEN_ID, token);
};

token.get = () => {
  return localStorage.getItem(TOKEN_ID);
};

token.getBearer = () => {
  return `Bearer ${token.get()}`;
};

export default token;
