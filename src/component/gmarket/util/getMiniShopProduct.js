import {getProductInfo} from "./smile";
import sleep from "../../../util/sleep";

const cheerio = require('cheerio');

const rand = (min, max) => {

    return Math.floor(Math.random() * (max - min + 1)) + min
}

export default async function getMinishopProduct(customer, updateStatus) {

    updateStatus("진행중");

    let items = [];
    let rank = 0;

    for (let i=1; i < 100; i++) {
        // 상품 목록 URL
        let url = "https://minishop.gmarket.co.kr/" + customer.customerId + "/List?CategoryType=General&SortType=" + customer.sort.code + "&DisplayType=LargeImage&Page=" + i + "&PageSize=100"
        if (customer.category) {
            url = "https://minishop.gmarket.co.kr/" + customer.customerId + "/List?CategoryType=General&Category=" + customer.category.categoryNum + "&SortType=" + customer.sort.code + "&DisplayType=LargeImage&Page=" + i + "&PageSize=100"
        }

        let data = await getProductList(url);

        let $ = cheerio.load(data);

        let itemLiList = $("#ItemList > div.prod_list > ul > li");

        if (!itemLiList || itemLiList.length === 0) {
            break;
        }

        for (const itemLi of itemLiList) {
            let itemTag = $(itemLi);

            let href = itemTag.find("a").attr("href");
            let url = new URL(href);
            let urlSearchParams = new URLSearchParams(url.search);
            let productNo = urlSearchParams.get("goodsCode");

            rank++;
            items.push({
                rank,
                itemNo: productNo,
            })
        }

        await sleep(rand(500, 2000))
    }

    let allProducts = [];
    const totalItems = items.length;

    let a = 0;
    for (const item of items) {
        // 진행률
        let progress = (++a / totalItems * 100).toFixed(1);
        updateStatus(`진행중(${progress}%)`);

        // 상품 옵션 가져오기 (상품 상세 페이지에서)
        let options = await getProductInfo(item);
        for (const option of options) {
            option.reviewPoint = {
                startPoint: option.reviewPoint,
                reviewCount: option.reviewCount,
            };
            option.itemUrl = "https://item.gmarket.co.kr/Item?goodscode=" + option.itemNo;
            allProducts.push(option);
        }

        await sleep(rand(2000, 5000))
    }

    return allProducts;
}

export async function getCat1(customerId) {
    let url = "https://minishop.gmarket.co.kr/" + customerId;

    let data = await getProductList(url);

    let $ = cheerio.load(data);

    let cats = $("#ulCategory > li");

    const categories = [];

    for (const cat of cats) {
        const href = $(cat).find("a").attr("href");
        const link = new URL(url + href);
        const categoryNum = link.searchParams.get("Category");
        const categoryName = $(cat).find("a").text().trim();
        categories.push({
            categoryName,
            categoryNum,
        });
    }

    return categories;
}

export async function getCat2(customerId, cat1Id) {
    let url = "https://minishop.gmarket.co.kr/" + customerId + "/List?Category="+ cat1Id +"&SortType=None&DisplayType=None";

    let data = await getProductList(url)

    let $ = cheerio.load(data);

    const cats = $("#ms_body > div.category_view > div.category_view_box  li");

    const categories = [];

    for (const cat of cats) {
        const href = $(cat).find("a").attr("href");
        const link = new URL("https://minishop.gmarket.co.kr/" + customerId + href);
        const categoryNum = link.searchParams.get("Category");
        const categoryName = $(cat).find("a").text().trim();
        categories.push({
            categoryName,
            categoryNum,
        });
    }

    return categories;
}


async function getProductList(url) {
    let data = await fetch(url, {
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
            "Referer": "https://www.gmarket.co.kr",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": null,
        "method": "GET"
    }).then(async res => await res.text());

    return data;
}