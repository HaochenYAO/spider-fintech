import router from './router';
import log from './log';

export default function (app) {
  app.use(log());
  app.use(router.routes()).use(router.allowedMethods());
}
