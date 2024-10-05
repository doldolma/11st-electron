import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


export default async function saveGmarketExcel(product) {

    // 워크북 생성
    const wb = XLSX.utils.book_new();

    // JSON 데이터를 워크시트로 변환
    const ws = XLSX.utils.json_to_sheet(preProcess(product));

    // 워크북에 워크시트 추가
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // 엑셀 파일 생성
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    // Blob 생성
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });

    // 파일 저장
    saveAs(data, 'data.xlsx');
}

function preProcess(productInfo) {
    return productInfo.products.map(p => {
        if (!p) return {};

        return {
            '랭킹': parseNumber(p.rank),
            '카테고리': productInfo.category.name ? productInfo.category.name : p.categoryName,
            '카테고리번호': productInfo.category.no,
            '상품명': p.itemName,
            '상품번호': p.itemNo,
            '판매가': parseNumber(p.sellPrice),
            '최종판매가': parseNumber(p.itemPrice),
            '할인율': null,
            '링크': p.itemUrl,
            '이미지링크': p.imageUrl,
            '리뷰점수': parseNumber(p.reviewPoint),
            '리뷰갯수': parseNumber(p.reviewCount),
            '구매개수': parseNumber(p.buyCount)
        }
    });
}

function parseNumber(num) {
    if (!num) return;
    if (typeof num === 'number') return num;
    if (typeof num === 'string') {
        return Number(num.replaceAll(',', '').replaceAll('원', '').trim());
    }
}