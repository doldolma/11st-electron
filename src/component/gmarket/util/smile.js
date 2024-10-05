import axios from "axios";
import sleep from "../../../util/sleep";
const cheerio = require('cheerio');

const min = 500;
const max = 2000;
const rand = () => {

    return Math.floor(Math.random() * (max - min + 1)) + min
}

export default async function getCategoryProducts(category, updateStatus) {

    updateStatus("진행중");

    // 카테고리 상품 목록
    let url = "https://www.gmarket.co.kr/n/smiledelivery/api/smiledelivery/category?categoryCode=" + category.no + "&s=" + category.sort;
    let response = (await axios.get(url));

    if (response.status !== 200) {
        console.log("통신에러");
        return;
    }

    let data = response.data;

    let pagination = data.pagination;

    let seachContent = data.searchContent;

    let items = [...seachContent.items];

    for (let i=2; i<pagination.pageSize; i++) {
        if (i > 4) {
            break;
        }

        let response = (await axios.get(url + "&page=" + i));
        try {
            let newItems = response.data.searchContent.items;
            for (const newItem of newItems) {
                newItem.rank = ((i - 1) * 60) + newItem.rank;
            }
            items = [...items, ...newItems];
        } catch(e) {
            console.error(e)
            continue;
        }
    }

    let allProducts = [];
    const totalItems = items.length;


    let a = 0;
    for (const item of items) {
        // 진행률
        let progress = (++a / totalItems * 100).toFixed(1);
        updateStatus(`진행중(${progress}%)`);

        // 상품 옵션 가져오기 (상품 상세 페이지에서)
        await sleep(rand());
        let options = await getProductInfo(item);
        allProducts = [...allProducts, ...options];
    }

    return allProducts;
}


// 상세 페이지
export async function getProductInfo(product) {

    let $ = await getProductHtml(product.itemNo);

    // 상품 정보
    product.itemName = $("#itemcase_basic > div.box__item-title > div.box__item-info > h1").text();
    product.imageUrl = "https:" +  $("#container > div.item-topinfowrap > div.thumb-gallery.uxecarousel > div.box__viewer-container > ul > li.on > a > img").first().attr("src");
    // 카테고리
    let categoryLi =  $("body > div.location-navi > ul > li")

    let i = 0;
    let categoryName = "";
    for (const categoryLiElement of categoryLi) {
        i++;

        let catName = $(categoryLiElement).find("a").first().text();

        if (i === 1) continue;
        if (i === 2) {
            categoryName = catName;
        } else {
            categoryName = categoryName + " > " + catName;
        }
    }
    product.categoryName = categoryName;

    if (product?.reviewPoint?.reviewCount) {
        product.reviewCount = product?.reviewPoint?.reviewCount;
        product.reviewPoint = product?.reviewPoint?.starPoint
    }

    // 별점
    if (!product.reviewCount) {
        const span = $("#itemcase_basic > div.box__item-title > div.box__item-info > div.box__rating-information > div > span");
        const style = span.attr('style');
        if (style) {
            const widthMatch = style.match(/width:\s*(\d+(?:\.\d+)?%)/);
            if (widthMatch) {
                const width = widthMatch[1];
                product.reviewPoint = (5 * (parseFloat(width) / 100)).toFixed(1);
            } else {
            }
        }
        // 별점 갯수
        product.reviewCount = parseInt($("#itemcase_basic > div.box__item-title > div.box__item-info > div.box__rating-information > span.box__rating-number").text().replaceAll("(", "").replaceAll(")", "").replaceAll(",", "").trim())
    }

    // 가격
    let price = getPrice($);
    product.itemPrice = price.itemPrice;
    product.sellPrice = price.sellPrice;

    // 옵션 목록
    let lis = $("#coreFormTop > div > div > div > ul > li");

    // 옵션 없음.
    if (lis.length === 0) {
        return [{...product}];
    }
    const products = [];

    for (const li of lis) {
        let optionTag = $(li);
        let productOption = {...product};

        // productOption.itemUrl = optionTag.find('a').attr('href');
        productOption.itemNo = optionTag.find('a').attr('data-goodscode');
        productOption.itemUrl = "https://item.gmarket.co.kr/Item?goodscode=" +  productOption.itemNo;
        // productOption.imageUrl = "https:" + optionTag.find('div.thumb img').attr('src');
        productOption.imageUrl = "https://gdimg.gmarket.co.kr/" + productOption.itemNo + "/still/1200"
        productOption.itemName = optionTag.find('span.item_tit').text();
        // productOption.itemPrice = optionTag.find('span.item_price:not(.item_price-coupon)').text().trim();

        // 가격 가져오기 위해 상세 상품 정보 로딩
        let optionHtml = await getProductHtml(productOption.itemNo);
        let price = getPrice(optionHtml);
        productOption.itemPrice = price.itemPrice;
        productOption.sellPrice = price.sellPrice;

        products.push(productOption);

        sleep(rand());
    }
    return products;
}

function getPrice($) {
    // 쿠폰가
    let itemPrice = Number($("#itemcase_basic > div.box__item-title > div.box__price.price .price_innerwrap-coupon .price_real").text().replaceAll(",", "").replaceAll("원", "").trim());
    if (!itemPrice) {
        // 쿠폰가 없으면 그냥 가격
        itemPrice = Number($("#itemcase_basic > div.box__item-title > div.box__price.price .price_real").text().replaceAll(",", "").replaceAll("원", "").trim());
    }

    // 원래가격
    let original = $("#itemcase_basic > div.box__item-title > div.box__price.price .price_original");

    let sellPrice = Number($(original).find("span.text__price-original").text().replaceAll(",", "").replaceAll("원", "").replaceAll("기존가", "").trim());

    if (!sellPrice) {
        sellPrice = itemPrice;
    }

    return {
        itemPrice,
        sellPrice
    }
}

async function getProductHtml(goodsCode) {
    // 조회
    let data = await  (await fetch("https://item.gmarket.co.kr/Item?goodscode="+goodsCode, {
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
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": null,
        "method": "GET"
    })).text();

    return cheerio.load(data);
}

// 단순히 이름과 가격만 있는 진짜 옵션
function getOptions(document) {
    let lis = document("#optOrderComb_0 > ul > li")

    let options = [];
    for (const li of lis) {

    }

    return options;
}