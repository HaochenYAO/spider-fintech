import Koa from 'koa';
import EventEmitter from 'events';
import middleware from './middleware';
import mongosdk from './sdk/mongosdk';

const app = new Koa();
const portDefault = 3007;

EventEmitter.defaultMaxListeners = 20;

mongosdk();
middleware(app);

app.listen(process.env.PORT || portDefault, () => {
  console.log('\x1b[36m%s\x1b[0m', `Listen to: ${portDefault}`);
});
