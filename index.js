const request = require("request-promise");
const cheerio = require("cheerio");
const fs = require("fs");
const json2csv = require("json2csv").Parser;

const movie = "https://www.imdb.com/title/tt7126948/?ref_=hm_cht_1";

(async () => {
  let imdbData = [];
  const response = await request({
    uri: movie,
    headers: {
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      "accept-encoding": "gzip, deflate, br",
      "accept-language": "en-US,en;q=0.9,kn;q=0.8",
    },
    gzip: true,
  });

  let $ = cheerio.load(response);
  const title = $('div[class="title_wrapper"] > h1').text().trim();
  const rating = $('div[class="ratingValue"] > strong > span').text();
  const status = $('div[class="status-message"] > h4').text().trim();
  imdbData.push({
    title,
    rating,
    status,
  });
  const jsontocsv = new json2csv();
  const csv = jsontocsv.parse(imdbData);
  fs.writeFileSync("./imdb.csv", csv, "utf-8");
})();
