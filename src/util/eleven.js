import axios from "axios";

const findType = 'PC_ProductGrid_Basic';

export default async function getCategoryProducts(category) {

    let data = (await axios.get("https://apis.11st.co.kr/pui/v2/page?pageId=PCSHOOTING_CATE&ctgr1No=" + category.no)).data;

    if (data.resultCode !== 200) {
        console.log("통신에러");
        return;
    }

    return findShootingBest(data.data);
}

function findShootingBest(carrList) {
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
                if (productsMeta.area === 'shooting_best') {
                    items = [...items, ...listElement.items];
                }
            }
        }
    }

    return items;
}