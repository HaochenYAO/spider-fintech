import Router from 'koa-router';
import spider from '../spider';

const router = new Router();

router
  .prefix('/crawl')
  .get('/:name/:platform/:page', async (ctx) => {
    spider(ctx.params.name, ctx.params.platform, ctx.params.page);
  });

export default router;
