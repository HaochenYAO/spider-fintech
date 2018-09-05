// eslint-disable-next-line import/no-dynamic-require, global-require
const data = item => require(`./${item}`).default;
export default data;
