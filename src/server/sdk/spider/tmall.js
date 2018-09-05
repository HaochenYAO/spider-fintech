import request from 'request';
import moment from 'moment';
import crypto from 'crypto';
import iconv from 'iconv-lite';

import { generateTmallSchema } from '../../model/generateSchema';
import data from '../../data';

const secret = 'sylvain';
const plat = 'tmall';
export default function (brand) {
  const options = {
    method: 'GET',
    uri: data(brand).platform[plat].url,
    headers: data(brand).headers,
    encoding: null,
  };
  request(options, (error, response, body) => {
    const Product = generateTmallSchema(brand + plat);
    let htmlString = iconv.decode(body, 'GBK');
    htmlString = htmlString.substring(0, htmlString.indexOf('本店内推荐'));
    const regexName = /<a class=\\"item-name[^>]*>\s*(.*?)\s*<\/a>/g;
    const regexPrice = /class=\\"c-price\\">\s*(\d+(\.\d+)?)\s*/g;
    const regexSale = /class=\\"sale-num\\">\s*(\d+(\.\d+)?)\s*/g;
    const regexExpName = new RegExp(regexName);
    const regexExpPrice = new RegExp(regexPrice);
    const regexExpSale = new RegExp(regexSale);
    const date = moment().format('D-M-YYYY');
    let matchName;
    let matchPrice;
    let matchSale;
    let f = true;
    do {
      matchName = regexExpName.exec(htmlString);
      matchPrice = regexExpPrice.exec(htmlString);
      matchSale = regexExpSale.exec(htmlString);
      if (matchName === null || matchPrice === null || matchSale === null) {
        f = false;
      } else {
        Product.create({
          _id: crypto.createHmac('sha256', secret)
            .update(`${matchName[1]}${date}`)
            .digest('hex'),
          name: matchName[1],
          brand,
          sale: matchSale[1],
          price: matchPrice[1],
          date,
          platform: plat,
        }, (err) => {
          if (err) {
            console.log(err);
          }
        });
      }
    } while (f);
    console.log('finish');
  });
}
