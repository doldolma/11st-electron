import axios from "axios";
import sleep from "../../../util/sleep";
const cheerio = require('cheerio');

const min = 100;
const max = 500;
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
    // 조회
    let data =await  (await fetch("https://item.gmarket.co.kr/Item?goodscode="+product.itemNo, {
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

    let $ = cheerio.load(data);

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
    if (!product.itemPrice) {
        // 쿠폰가
        product.itemPrice = Number($("#itemcase_basic > div.box__item-title > div.box__price.price .price_innerwrap-coupon .price_real").text().replaceAll(",", "").replaceAll("원", "").trim());
        if (!product.itemPrice) {
            // 쿠폰가 없으면 그냥 가격
            product.itemPrice = Number($("#itemcase_basic > div.box__item-title > div.box__price.price .price_real").text().replaceAll(",", "").replaceAll("원", "").trim());
        }

        console.log("price", product.itemPrice)

    }

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
        productOption.itemPrice = optionTag.find('span.item_price:not(.item_price-coupon)').text().trim();

        products.push(productOption);
    }
    return products;
}

// 단순히 이름과 가격만 있는 진짜 옵션
function getOptions(document) {
    let lis = document("#optOrderComb_0 > ul > li")

    let options = [];
    for (const li of lis) {

    }

    return options;
}