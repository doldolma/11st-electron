import axios from "axios";

const findType = 'PC_ProductGrid_Basic';

export default async function getCategoryProducts(category, updateStatus) {

    updateStatus("진행중");

    let data = (await axios.get("https://apis.11st.co.kr/pui/v2/page?pageId=PCSHOOTING_CATE&" + category.url + "&sort=" + category.sort)).data;

    if (data.resultCode !== 200) {
        console.log("통신에러");
        return;
    }

    const isBigCategory = !category.url.includes('ctgr2No');

    let items = [];
    if (isBigCategory) {
        items = await getBigCategoryProducts(category);
    } else {
        items = await getSmallCategoryProducts(category);
    }

    // 옵션들 가져오기
    return await getAllOptions(items, updateStatus);

}

async function getBigCategoryProducts(category) {

    let data = (await axios.get("https://apis.11st.co.kr/pui/v2/page?pageId=PCSHOOTING_CATE&" + category.url + "&sort=" + category.sort)).data;

    if (data.resultCode !== 200) {
        console.log("통신에러");
        return;
    }

    let carrList = data.data;

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
                if (productsMeta.area === 'shooting_best') {
                    items = [...items, ...listElement.items];
                }
            }
        }
    }

    return items;
}

// 소규모 카테고리.. 10페이지까지.. 중간에 아이템 없으면 멈추기
async function getSmallCategoryProducts(category) {
    let allItems = [];
    let rank = 1;

    for (let i = 1; i < 10; i++) {
        let data = (await axios.get("https://apis.11st.co.kr/pui/v2/page?pageId=PCSHOOTING_CATE&" + category.url + "&pageNo=" + i + "&sort=" + category.sort)).data;

        if (data.resultCode !== 200) {
            console.log("통신에러");
            return;
        }
        let carrList = data.data;

        let items = [];

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
                    if (productsMeta.area === 'productlist') {
                        items = [...items, ...listElement.items];
                    }
                }
            }
        }

        if (items.length === 0) {
            // 그만하자
            break;
        } else {
            allItems = [...allItems, ...items];
        }
    }
    return allItems;
}

async function findShootingBest(carrList, isBigCategory, updateStatus) {
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
                    if (productsMeta.area === 'shooting_best' || productsMeta.area === 'productlist') {
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

    let totalItems = items.length;

    let products = [];

    // 옵션 가져오기
    let a = 0;
    for (const item of items) {
        let progress = (++a / totalItems * 100).toFixed(1);
        updateStatus(`진행중(${progress}%)`);

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

async function getAllOptions(items, updateStatus) {
    let totalItems = items.length;

    let products = [];

    // 옵션 가져오기
    let a = 0;
    for (const item of items) {
        let progress = (++a / totalItems * 100).toFixed(1);
        updateStatus(`진행중(${progress}%)`);

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