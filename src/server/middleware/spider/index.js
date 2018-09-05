import jd from '../../sdk/spider/jd';
import tmall from '../../sdk/spider/tmall';

export default function (brand, platform, page) {
  if (platform === 'jd') {
    jd(brand, page);
  } else {
    tmall(brand);
  }
}
