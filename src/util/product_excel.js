import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export default async function saveExcel(product) {

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
            '카테고리': productInfo.category.name,
            '카테고리번호': productInfo.category.no,
            '상품명': p.title?.name,
            '상품번호': String(p.acmeInfo?.productNo),
            '판매가': parseNumber(p.price?.sellPrice),
            '최종판매가': parseNumber(p.price?.finalDscPrice),
            '할인율': parseNumber(p.price?.discountRate),
            '링크': p.acmeInfo?.productNo ? "https://www.11st.co.kr/products/pa/" + p.acmeInfo?.productNo : '',
            '이미지링크': p.logData?.product_image_url,
            '리뷰점수': parseNumber(p.title?.reviewSatisfy),
            '리뷰갯수': parseNumber(p.title?.reviewCount),
        }
    });
}

function parseNumber(num) {
    if (!num) return;
    if (typeof num === 'number') return num;
    if (typeof num === 'string') {
        return Number(num.replaceAll(',', ''));
    }
}