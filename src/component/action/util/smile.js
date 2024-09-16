const cheerio = require('cheerio');

export default async function getCategoryProducts(category, updateStatus) {

    updateStatus("진행중");

    let products = [];
    // 카테고리 상품 목록
    for (let i=1; i<5; i++) {
        let res = await getPage(category.no, i);

        const $ = cheerio.load(res);

        const targetUls = $('ul.promotion_item_list.normal_item_list');
        if (targetUls.length === 0) {
            break;
        }

        let rank = 0;
        for (const targetUl of targetUls) {
            const ul = $(targetUl);
            let lis = ul.find("li");
            for (const li of lis) {
                rank++;
                let liTag = $(li);
                let $a = liTag.find('a');

                const itemUrl = $a.attr('href');
                let url = new URL(itemUrl);
                let urlSearchParams = new URLSearchParams(url.search);
                const itemNo = urlSearchParams.get("itemNo");

                const noscriptContent = $a.find('noscript').html();
                const $noscriptParsed = cheerio.load(noscriptContent);
                const imageUrl = "https:" + $noscriptParsed('img').attr('src');

                const itemName = $a.find("span.item_name").text().trim();

                const itemPrice = $a.find("span.item_price").text().trim();

                const reviewPoint = $a.find("span.text__score").text().trim();

                let reviewCount = $a.find("span.box__score-awards > span.text__num").text().trim();
                reviewCount = reviewCount.replace("(", "").replace(")", "").trim();

                let product = {
                    rank,
                    itemNo,
                    itemUrl,
                    imageUrl,
                    itemName,
                    itemPrice,
                    reviewPoint,
                    reviewCount,
                }

                products.push(product);
            }
        }
    }

    let allProducts = [];
    const totalItems = products.length;

    let a = 0;
    for (const product of products) {
        let progress = (++a / totalItems * 100).toFixed(1);
        updateStatus(`진행중(${progress}%)`);

        let options = await getProductInfo(product);
        allProducts = [...allProducts, ...options];
    }

    return allProducts;
}


// 상세 페이지
async function getProductInfo(product) {
    let response = await  (await fetch("http://itempage3.auction.co.kr/DetailView.aspx?itemNo=" + product.itemNo,{
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
    }));

    let buffer = await response.arrayBuffer();
    let decoder = new TextDecoder('euc-kr');
    let data = decoder.decode(buffer);

    let $ = cheerio.load(data);

    let optionLis = $("#upOrderInfo > fieldset > div.select-item > div.optiontype.type_group > div > ul.Group_Item_List_Wrapper > li");

    if ( optionLis.length === 0) {
        // 옵션 없음
        return [{...product}];
    }

    const products = [];

    for (const optionLi of optionLis) {
        const liTag = $(optionLi);
        let productOption = {...product};

        let img = liTag.find(".option_thumb > img");
        productOption.imageUrl = img.attr("src");

        const onClick = liTag.find("a").attr("onclick");

        productOption.itemNo = parseItemNo(onClick);
        productOption.itemName = liTag.find("span.option_prod").text().trim();

        let itemPrice = liTag.find("span.text_price-coupon > strong.num").text().trim();
        if (!itemPrice) {
            itemPrice = liTag.find("span.text_price > strong.num").text().trim();
        }
        productOption.itemPrice = itemPrice;

        products.push(productOption);
    }

    return products;
}


async function getPage(categoryNo, pageNumber) {
    // 조회
    return await  (await fetch("https://www.auction.co.kr/n/smiledelivery/category?categoryCode=" + categoryNo + "&p="+pageNumber, {
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
}


function parseItemNo(onClick) {
    // sendEvt 함수의 JSON 부분을 추출
    const jsonMatch = onClick.match(/sendEvt\([^{]*(\{[^}]+\})/);

    if (jsonMatch) {
        try {
            // JSON 문자열을 파싱
            const jsonStr = jsonMatch[1].replace(/'/g, '"'); // 작은따옴표를 큰따옴표로 변경
            const data = JSON.parse(jsonStr);

            // itemno 값 추출
            const itemNo = data.itemno;
            return itemNo;
        } catch (error) {
            console.error("JSON 파싱 오류:", error);
        }
    } else {
        console.log("JSON 데이터를 찾을 수 없습니다.");
    }
}