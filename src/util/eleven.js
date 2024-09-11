import axios from "axios";

const findType = 'PC_ProductGrid_Basic';

export default async function getCategoryProducts(category) {

    let data = (await axios.get("https://apis.11st.co.kr/pui/v2/page?pageId=PCSHOOTING_CATE&" + category.url)).data;

    if (data.resultCode !== 200) {
        console.log("통신에러");
        return;
    }

    const isBigCategory = !category.url.includes('ctgr2No');

    return (await findShootingBest(data.data, isBigCategory));
}

async function findShootingBest(carrList, isBigCategory) {
    let items = [];
    let rank = 1;

    for (const carr of carrList) {
        // PC_ProductGrid_Basic 타입 찾기
        let blockList = carr.blockList;
        if (!blockList) continue;


        for (const block of blockList) {
            if (block.type !== findType) {
                continue;
            }

            // products
            let list = block.list;
            if (!list) continue;

            for (const listElement of list) {
                let productsMeta = listElement.logData;
                for (const item of listElement.items) {
                    item.rank = rank;
                    rank++;
                }
                if (isBigCategory) {
                    if (productsMeta.area === 'shooting_best') {
                        items = [...items, ...listElement.items];
                    }
                } else {
                    if (productsMeta.area === 'productlist') {
                        items = [...items, ...listElement.items];
                    }
                }
            }
        }
    }

    let products = [];

    // 옵션 가져오기
    for (const item of items) {
        let newVar = await getOptions(item.prdNo);

        if (!newVar) {
            // 옵션이 없으니 현재 상품 정보 조회 해서 추가 하기
            let product = await getProductInfo(item.prdNo);
            if (product) {
                product.rank = item.rank;
                products.push(product);
            }
        } else {
            for (const newVarElement of newVar) {
                let product = await getProductInfo(newVarElement.productNo);
                product.rank = item.rank;
                if (product) {
                    products.push(product);
                }
            }
        }
    }

    return products;
}

async function getOptions(productNo) {

    const data = (await axios.get("https://www.11st.co.kr/products/v1/" + productNo + "/atf/variations/pc")).data;

    if (!data) return

    let variations = data.variations;

    if (!variations) return;

    return variations[0].items;

}

async function getProductInfo(productNo) {
    return (await axios.get("https://www.11st.co.kr/products/v1/pc/products/" + productNo + "/detail")
        .then(res => res.data)
        .catch(err => null));
}