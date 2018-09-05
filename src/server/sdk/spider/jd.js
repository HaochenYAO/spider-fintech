import request from 'request';
import moment from 'moment';
import crypto from 'crypto';
import iconv from 'iconv-lite';

import { generateJdSchema } from '../../model/generateSchema';
import data from '../../data';

const secret = 'sylvain';
const plat = 'jd';

export default function (brand, page) {
  // fetch id
  const options = {
    method: 'GET',
    uri: data(brand).platform[plat].url + page,
    headers: data(brand).headers,
    encoding: null,
  };
  request(options, (error, response, body) => {
    const Product = generateJdSchema(brand + plat);
    const htmlString = iconv.decode(body, 'utf8');
    const regexName = /alt=\\"(.*?)\\"\/>/g;
    const regexId = /jdprice='(\d+)' >/g;
    const regexExpName = new RegExp(regexName);
    const regexExpId = new RegExp(regexId);
    const date = moment().format('D-M-YYYY');
    const result = [];
    const idList = [];
    const skuidList = [];
    let matchName;
    let matchId;
    let f = true;
    do {
      matchName = regexExpName.exec(htmlString);
      matchId = regexExpId.exec(htmlString);
      if (matchId === null || matchName === null) {
        f = false;
      } else {
        result.push({
          name: matchName[1],
        });
        skuidList.push(`J_${matchId[1]}`);
        idList.push(matchId[1]);
      }
    } while (f);
    const skuidString = skuidList.join(',');
    const idString = idList.join(',');

    // fetch price
    const optionsP = {
      method: 'GET',
      uri: data(brand).platform[plat].url_price + skuidString,
      headers: data(brand).headers,
      encoding: null,
    };

    request(optionsP, (errorP, responseP, bodyP) => {
      let htmlStringP = iconv.decode(bodyP, 'utf8');
      htmlStringP = htmlStringP.substring(14, htmlStringP.length - 3);
      const jsonP = JSON.parse(htmlStringP);
      for (let i = 0; i < jsonP.length; i += 1) {
        const index = skuidList.indexOf(jsonP[i].id);
        result[index].price = jsonP[i].p;
      }

      // fetch comments
      const optionsC = {
        method: 'GET',
        uri: data(brand).platform[plat].url_comment + idString,
        headers: data(brand).headers,
        encoding: null,
      };
      request(optionsC, (errorC, responseC, bodyC) => {
        let htmlStringC = iconv.decode(bodyC, 'utf8');
        htmlStringC = htmlStringC.substring(14, htmlStringC.length - 2);
        const jsonC = JSON.parse(htmlStringC).CommentsCount;
        for (let i = 0; i < jsonC.length; i += 1) {
          const index = idList.indexOf(jsonC[i].ProductId.toString());
          result[index].comment = jsonC[i].CommentCount;
          result[index].rate = jsonC[i].GoodRate;
        }

        for (let i = 0; i < result.length; i += 1) {
          Product.create({
            _id: crypto.createHmac('sha256', secret)
              .update(`${result[i].name}${date}`)
              .digest('hex'),
            name: result[i].name,
            brand,
            comment: result[i].comment,
            price: result[i].price,
            rate: result[i].rate,
            date,
            platform: plat,
          }, (err) => {
            if (err) {
              console.log(err);
            }
          });
        }
        console.log('finish');
      });
    });
  });
}
