import axios from "axios";

const findType = 'PC_ProductGrid_Basic';

export default async function getCategoryProducts(category) {

    let data = (await axios.get("https://apis.11st.co.kr/pui/v2/page?pageId=PCSHOOTING_CATE&" + category.url)).data;

    if (data.resultCode !== 200) {
        console.log("통신에러");
        return;
    }

    const isBigCategory = !category.url.includes('ctgr2No');

    return findShootingBest(data.data, isBigCategory);
}

function findShootingBest(carrList, isBigCategory) {
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

    return items;
}