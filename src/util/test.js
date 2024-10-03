import {cheerio} from "cheerio/src/__fixtures__/fixtures";

let url = "https://www.gmarket.co.kr/n/smiledelivery/category?categoryCode="

export default async function getCategoryGmarket(categoryNo) {
// 조회
    let html = await  (await fetch(url + categoryNo, {
        "headers": {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
            "priority": "u=0, i",
            "sec-ch-ua": "\"Chromium\";v=\"128\", \"Not;A=Brand\";v=\"24\", \"Google Chrome\";v=\"128\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"macOS\"",
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "same-origin",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1",
            "Referer": "https://www.action.co.kr",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": null,
        "method": "GET"
    })).text();

    let $ = cheerio.load(html);

    let items = $('#container > div.wrap__body > div.wrap__filter > ul > li.wrap__filter-item.category.active > div > ul.list__items');

    let subCats = [];

    for (const item of items) {
        const itemTag = $(item);

        const inputTag = itemTag.find('input');
        const inputValue = inputTag.val(); // input의 value 속성 값
        const itemText = itemTag.text().trim();

        subCats.push({
            categoryType: "THIRD",
            categoryNo: inputValue,
            categoryName: itemText,
        });
    }

    return subCats;
}