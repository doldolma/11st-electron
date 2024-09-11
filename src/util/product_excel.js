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
    return productInfo.products.map((p, i) => {
        return {
            '랭킹': p.rankInfo ? parseNumber(p.rankInfo?.rank) : i + 1,
            '카테고리': productInfo.category.name,
            '카테고리번호': productInfo.category.no,
            '상품명': p.prdNm,
            '상품번호': p.prdNo,
            '판매가': parseNumber(p.sellPrice),
            '최종판매가': parseNumber(p.finalDscPrice),
            '할인율': parseNumber(p.discountRate),
            '링크': p.linkUrl,
            '이미지링크': 'https:' + p.imageUrl,
            '이미지설명': p.imageUrlAlt,
            '리뷰점수': parseNumber(p.review?.point),
            '리뷰갯수': parseNumber(p.review?.count),
        }
    });
}

function parseNumber(num) {
    if (!num) return;
    return Number(num.replaceAll(',', ''));
}