// const accTokenExp = 60 * 60 * 3;
const accTokenExp = +process.env.ACCESS_TOKEN_TIME ?? 60 * 30;

const refTokenExp = +process.env.REFRESH_TOKEN_TIME ?? 24 * 60 * 60;
export const accessTokenOptions = {
  expiresIn: accTokenExp,
  secret: process.env.JWT_ACCESS_SECRET ?? 'access_secret',
};
export const refreshTokenOptions = {
  expiresIn: refTokenExp,
};
