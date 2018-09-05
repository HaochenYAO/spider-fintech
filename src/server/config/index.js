// eslint-disable-next-line import/no-dynamic-require, global-require
const config = name => require(`./${process.env.NODE_ENV || 'development'}`).default[name];

export default config;
