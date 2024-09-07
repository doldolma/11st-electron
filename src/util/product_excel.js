import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export default async function saveExcel(product) {

    console.log(product);

    // 워크북 생성
    const wb = XLSX.utils.book_new();

    // JSON 데이터를 워크시트로 변환
    const ws = XLSX.utils.json_to_sheet(preProcess(product.products));

    // 워크북에 워크시트 추가
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // 엑셀 파일 생성
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    // Blob 생성
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });

    // 파일 저장
    saveAs(data, 'data.xlsx');
}


function preProcess(product) {
    return product.map(p => {
        return {
            rank: parseNumber(p.rankInfo?.rank),
            review: parseNumber(p.review?.point),
            reviewCount: parseNumber(p.review?.count),
            prdNm: p.prdNm,
            prdNo: p.prdNo,
            sellPrice: parseNumber(p.sellPrice),
            finalDscPrice: parseNumber(p.finalDscPrice),
            discountRate: parseNumber(p.discountRate),
            linkUrl: p.linkUrl,
            imageUrl: 'https:' + p.imageUrl,
            imageUrlAlt: p.imageUrlAlt,
        }
    });
}

function parseNumber(num) {
    if (!num) return;
    return Number(num.replaceAll(',', ''));
}