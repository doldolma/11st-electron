let fs = require('fs');
const cheerio = require('cheerio');


const categories = [
    {
        "categoryType": "LARGE",
        "categoryNo": "1000007",
        "categoryName": "빠른장보기",
        "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/82c17a82-bd27-41d9-a9e4-28c36f522b0b.gif",
        "priority": 1,
        "subCategories": [
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2005073",
                "categoryName": "과자/간식",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/f3701b7d-41db-421b-b1ef-b90f0213c73c.png",
                "priority": 1,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2005074",
                "categoryName": "냉동/즉석식품",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/ed8b201d-61d0-4966-9b61-348e310f27c6.png",
                "priority": 2,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2006073",
                "categoryName": "라면/면",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/02185128-96ca-4900-b177-32c33b67a143.png",
                "priority": 3,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2005075",
                "categoryName": "통조림",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/bd6d8e48-a2ff-4061-ad44-2493ccb09d81.png",
                "priority": 4,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2005076",
                "categoryName": "생수/탄산수",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/079e72eb-2ab7-42e9-9fc4-b4ee8ae3b9f8.png",
                "priority": 5,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2005077",
                "categoryName": "우유",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/5ad7959b-f4a0-4f01-84fd-69d448f6d2ba.png",
                "priority": 6,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2005078",
                "categoryName": "두유",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/8ddd9841-f4ac-491d-a66c-4d5f015d7c90.png",
                "priority": 7,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2005079",
                "categoryName": "커피/차",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/46ef73c3-a57d-4d60-a00c-61e6c0ea1fb6.png",
                "priority": 8,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2006074",
                "categoryName": "주스",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/38fec6c0-d7b0-4234-9f46-71a97b6b6a45.png",
                "priority": 9,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2005080",
                "categoryName": "탄산/기능성음료",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/bd1b9903-af7f-456a-81a7-b5d7f0936a95.png",
                "priority": 10,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2005081",
                "categoryName": "영양제/건강보조제",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/ee9cbe2c-12fe-4b10-82e7-c60583ff8a4c.png",
                "priority": 11,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2005082",
                "categoryName": "건강즙",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/ddb98577-3f27-4404-b514-0824f5f555aa.png",
                "priority": 12,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2005083",
                "categoryName": "화장지",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/5e27a8ac-d1c2-443f-9162-8f0a797d9b2b.png",
                "priority": 13,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2005084",
                "categoryName": "물티슈",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/6c4488c1-7a1a-4083-b42f-655b2445bfc3.png",
                "priority": 14,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2005085",
                "categoryName": "세탁세제",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/2e3f9d05-19eb-4854-9deb-f78c0d5f7906.png",
                "priority": 15,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2005086",
                "categoryName": "주방세제",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/34b5ccea-0a35-4bb5-8140-c5d98818a73a.png",
                "priority": 16,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2005087",
                "categoryName": "섬유유연제",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/361b6cda-041f-4016-aa8d-355a9640b0a5.png",
                "priority": 17,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2005088",
                "categoryName": "세정제",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/3950d977-0fa6-48d3-b3cb-9f12d027cdfd.png",
                "priority": 18,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2006075",
                "categoryName": "치약/칫솔",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/db97b1e0-4e84-40ec-b837-176aaf6bb7de.png",
                "priority": 19,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2005089",
                "categoryName": "샴푸/린스",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/ff58b157-3500-45f1-9bb6-66de0184da04.png",
                "priority": 20,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2005090",
                "categoryName": "바디케어",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/18d152a8-c48f-42eb-980c-ad1364987b34.png",
                "priority": 21,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2005091",
                "categoryName": "클렌징/필링",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/f65fb307-2f0a-416d-a378-96a248ed5e67.png",
                "priority": 22,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2006076",
                "categoryName": "스킨/로션",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/96769c53-a34f-45b0-bae7-8c05a3d389cf.png",
                "priority": 23,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2006077",
                "categoryName": "기저귀",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/38a2eeb7-bf42-4931-a776-5408e7440165.png",
                "priority": 24,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2005092",
                "categoryName": "분유",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/dfc5e128-e8d1-4bea-b5a6-89be254b1816.png",
                "priority": 25,
                "subCategories": []
            }
        ]
    },
    {
        "categoryType": "LARGE",
        "categoryNo": "1002013",
        "categoryName": "신선식품",
        "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/f05b7267-469c-4c2f-b11f-d57295f32b86.png",
        "priority": 2,
        "subCategories": [
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2009091",
                "categoryName": "농산물",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/d8703cf5-cb0c-4313-afa4-7ec558f25bcd.png",
                "priority": 1,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2006099",
                "categoryName": "수산물",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/973b972c-931a-47d8-ab95-266f68fd10f0.png",
                "priority": 2,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2006100",
                "categoryName": "축산물",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/3e692707-6d5a-43cd-b25b-cb7e1ce6bd4a.png",
                "priority": 3,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2009090",
                "categoryName": "쌀/잡곡/견과",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/fc34897e-b613-4de2-8a7d-035ed03bd160.png",
                "priority": 4,
                "subCategories": []
            }
        ]
    },
    {
        "categoryType": "LARGE",
        "categoryNo": "1000001",
        "categoryName": "가공식품",
        "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/64f0cd8b-2ec1-460d-9f45-44cd46e94190.png",
        "priority": 3,
        "subCategories": [
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2000008",
                "categoryName": "즉석/간편식품",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/772314c4-6b0c-4a08-a53e-6d1e98fd822e.png",
                "priority": 1,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2000001",
                "categoryName": "과자/간식",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/0f69e319-d5f5-43b2-a740-48e2f046c782.png",
                "priority": 2,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2000002",
                "categoryName": "라면/면",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/8e1f4818-8d3c-4af7-a977-7f487590771b.png",
                "priority": 3,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2000003",
                "categoryName": "김치/반찬/젓갈",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/00f21049-bee9-418a-8168-499018d52376.png",
                "priority": 4,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2000007",
                "categoryName": "조미료/소스/장류",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/0d166876-bbe7-4fc9-9b44-ac88b6c6c7ac.png",
                "priority": 5,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2000010",
                "categoryName": "통조림/식용유/잼",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/24becd09-ce25-4205-af76-ae024eb865c4.png",
                "priority": 6,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2006080",
                "categoryName": "건강기능식품",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/b4d064c5-870a-42d9-9a76-3fb46d000aca.png",
                "priority": 7,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2006081",
                "categoryName": "건강즙/환/분말",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/e4a50aed-4437-4229-b3ca-63bd0e463a09.png",
                "priority": 8,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2006082",
                "categoryName": "인삼/홍삼/한방재료",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/4165f9f9-f68a-471c-a827-447092ffc622.png",
                "priority": 9,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2004074",
                "categoryName": "세트상품",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/2477d44f-94fd-447f-92a6-9b53fd1e9843.png",
                "priority": 10,
                "subCategories": []
            }
        ]
    },
    {
        "categoryType": "LARGE",
        "categoryNo": "1000002",
        "categoryName": "생활",
        "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/373be37c-0476-4462-909f-1182c14a12d5.png",
        "priority": 4,
        "subCategories": [
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2000021",
                "categoryName": "세제/섬유유연제",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/ae3d98d8-063e-4ec4-ad87-92b7c1a0684e.png",
                "priority": 1,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2000028",
                "categoryName": "화장지/물티슈/생리대",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/a8470a18-16fc-4038-8e92-33b685a3f9dc.png",
                "priority": 2,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2000024",
                "categoryName": "청소/세탁용품",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/ead5a189-f4d8-4387-b567-a321157fd3fc.png",
                "priority": 3,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2000025",
                "categoryName": "치약/칫솔/면도용품",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/560f5135-80a6-40e4-9745-2fefd3bc7832.png",
                "priority": 4,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2000027",
                "categoryName": "헤어케어/스타일링",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/887dfd65-d654-4d76-ab65-bc86611b8d88.png",
                "priority": 4,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2000019",
                "categoryName": "바디케어",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/99a1e856-c865-4eef-ba20-b19cc63774e9.png",
                "priority": 6,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2000026",
                "categoryName": "탈취제/살충제/제습제",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/cd433299-3fa5-46e5-ae1c-e53cc7432db4.png",
                "priority": 7,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2000023",
                "categoryName": "욕실/목욕용품",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/fb88d1a2-7108-4f50-b7db-d70ac956267b.png",
                "priority": 9,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2000020",
                "categoryName": "생활잡화",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/4a25f7ed-2c10-41c1-9c1f-419098d15398.png",
                "priority": 10,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2000022",
                "categoryName": "수납정리",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/4af6ce4b-2431-4ce5-8729-fba2ee92671c.png",
                "priority": 11,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2006086",
                "categoryName": "홈인테리어/가구",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/165c3b1d-a3c7-45c8-9633-caef8840943e.png",
                "priority": 15,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2000018",
                "categoryName": "공구/자재",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/0d81a512-0ff7-4cb6-99ae-afaf2a573111.png",
                "priority": 17,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2006083",
                "categoryName": "세트상품",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/d20e120f-fbf3-460d-b53d-1f642b5967fd.png",
                "priority": 25,
                "subCategories": []
            }
        ]
    },
    {
        "categoryType": "LARGE",
        "categoryNo": "1003013",
        "categoryName": "주방",
        "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/f7a321bf-efd7-4584-aff1-7acc0dc2109a.png",
        "priority": 5,
        "subCategories": [
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2010087",
                "categoryName": "조리기구/도구",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/42e01ab4-fe39-44ce-8e97-11c7ed0a6079.png",
                "priority": 1,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2009087",
                "categoryName": "주방용품/소모품",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/860dec1d-cbfb-4fa7-b6a8-58a2304d56a6.png",
                "priority": 1,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2009088",
                "categoryName": "테이블웨어",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/875fa51d-b8be-4e1b-ab9f-fb98b45cd4a0.png",
                "priority": 3,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2009089",
                "categoryName": "식기세트",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/5b4dca07-6f6e-40b5-83c1-a02ffbf81f64.png",
                "priority": 4,
                "subCategories": []
            }
        ]
    },
    {
        "categoryType": "LARGE",
        "categoryNo": "1000003",
        "categoryName": "생수/음료",
        "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/ab418a42-da03-4095-890c-27303767ab7d.png",
        "priority": 6,
        "subCategories": [
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2000013",
                "categoryName": "생수/탄산수",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/a0a37ce1-f1c1-4456-ab85-e706b2f019f9.png",
                "priority": 1,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2000016",
                "categoryName": "커피/코코아",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/eadc9288-981a-4146-8481-a93f97056ea9.png",
                "priority": 2,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2000012",
                "categoryName": "두유",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/b1526492-91d8-4df1-992f-58da60575630.png",
                "priority": 3,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2003073",
                "categoryName": "우유",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/5652f6f4-1875-4c67-98e8-4035072b6c3b.png",
                "priority": 4,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2000017",
                "categoryName": "탄산음료/기능성음료",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/5dec9355-45c4-4e7e-bce2-e78e3e3b26ff.png",
                "priority": 5,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2000014",
                "categoryName": "주스/과채음료",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/c8e0e27c-997e-441f-8ece-44b996151e1f.png",
                "priority": 6,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2000015",
                "categoryName": "차류/티백/분말",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/aa5ace02-83a9-4469-8cd5-a53abbfb8073.png",
                "priority": 6,
                "subCategories": []
            }
        ]
    },
    {
        "categoryType": "LARGE",
        "categoryNo": "1001003",
        "categoryName": "유아동",
        "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/9902b0b8-f554-4eac-a267-d69cbf00c0ca.png",
        "priority": 7,
        "subCategories": [
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2000040",
                "categoryName": "장난감",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/43077d14-dd92-46ef-8b35-a02541483531.png",
                "priority": 1,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2001012",
                "categoryName": "기저귀/분유/식품",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/90625222-1a65-4711-98fb-3f14c27913de.png",
                "priority": 2,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2000042",
                "categoryName": "유아동스킨케어",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/87221206-28bd-4eff-8b22-f370b0c28e35.png",
                "priority": 4,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2000043",
                "categoryName": "육아용품",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/d2d8441b-39e3-419f-ae36-ad6065638e33.png",
                "priority": 5,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2000044",
                "categoryName": "유아동의류/잡화",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/c83056f2-f488-4170-b929-2a51ff4ab1f4.png",
                "priority": 7,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2000046",
                "categoryName": "출산/수유용품",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/ddcdf983-376a-4e9b-ac46-7c1c87bb0320.png",
                "priority": 9,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2000047",
                "categoryName": "외출용품",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/f4117071-0413-4faf-bc35-9203093843ec.png",
                "priority": 10,
                "subCategories": []
            }
        ]
    },
    {
        "categoryType": "LARGE",
        "categoryNo": "1001001",
        "categoryName": "가전/디지털",
        "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/60974302-6a06-4bda-aa20-c39f77b22680.png",
        "priority": 8,
        "subCategories": [
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2001002",
                "categoryName": "난방/냉방가전",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/6f9159c4-c1a8-4f2d-bfa9-5a7704d308c8.png",
                "priority": 1,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2001006",
                "categoryName": "주방가전",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/161aa850-4be5-4adb-8a3c-ea052c315728.png",
                "priority": 2,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2001001",
                "categoryName": "공기청정기/가습기",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/2a1e1cbe-ca02-4d81-8b2a-9dc63ead46cb.png",
                "priority": 2,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2001007",
                "categoryName": "생활가전",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/f2e87af8-ea5f-498e-a5a4-4b391c403fb5.png",
                "priority": 4,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2001005",
                "categoryName": "음향기기",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/a68faa9a-62ea-448c-9bbd-89058fa1b507.png",
                "priority": 6,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2001004",
                "categoryName": "TV/모니터/프린터",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/26eb5225-688d-465a-940a-3edcb09ba4dd.png",
                "priority": 7,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2005095",
                "categoryName": "PC주변기기",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/32bd3f38-1e7c-4834-8392-1de7512d3ff4.png",
                "priority": 8,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2005096",
                "categoryName": "저장장치",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/bae839f4-8667-439d-9697-a9026dff18df.png",
                "priority": 9,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2005097",
                "categoryName": "노트북/PC/게임기",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/333fed7b-a73a-4d7c-a267-2b5333a5a623.png",
                "priority": 10,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2005098",
                "categoryName": "태블릿/웨어러블",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/89df06ea-c1a7-4268-982d-d94d524b24fb.png",
                "priority": 11,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2005099",
                "categoryName": "휴대폰",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/e329fa58-e6f8-4b4c-9766-f7a6a0ed1c5f.png",
                "priority": 12,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2005100",
                "categoryName": "카메라/캠코더",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/7a4926c8-50e0-4a21-83a8-9602eae5b9ce.png",
                "priority": 13,
                "subCategories": []
            }
        ]
    },
    {
        "categoryType": "LARGE",
        "categoryNo": "1001004",
        "categoryName": "건강",
        "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/cb9d1f76-456f-452a-aa6d-943904abbb07.png",
        "priority": 9,
        "subCategories": [
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2001014",
                "categoryName": "건강기능식품",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/e303f862-ea83-4176-8b9d-5ba37dc4ac5d.png",
                "priority": 1,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2001016",
                "categoryName": "건강즙/환/분말",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/bc6e1f65-ee45-4f3e-a299-c6c0076c51de.png",
                "priority": 2,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2001015",
                "categoryName": "인삼/홍삼/한방재료",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/ff41b1a3-f6e8-4d49-9537-b47024f1e8f8.png",
                "priority": 3,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2005093",
                "categoryName": "건강관리용품",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/d813755d-ce40-4e30-ae73-6df316d0c64a.png",
                "priority": 6,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2006078",
                "categoryName": "일반의약외품",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/ed421e3f-23be-4f6d-b7b0-7c946925c167.png",
                "priority": 6,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2006079",
                "categoryName": "건강측정용품",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/a60b5cce-132c-4c4f-8b1a-f82985f37cfe.png",
                "priority": 7,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2005094",
                "categoryName": "안마/찜질",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/571d33f6-7080-43ae-a521-11e6862a2c95.png",
                "priority": 8,
                "subCategories": []
            }
        ]
    },
    {
        "categoryType": "LARGE",
        "categoryNo": "1001006",
        "categoryName": "뷰티",
        "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/8d4f8d75-fe7d-427c-9e7d-206a679d73b0.png",
        "priority": 10,
        "subCategories": [
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2001032",
                "categoryName": "스킨케어",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/9dbba924-50f6-4ed4-b69b-fca5788d55d0.png",
                "priority": 1,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2001031",
                "categoryName": "메이크업/선케어",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/d3d07dd0-aa12-4d2f-8857-7a71a524f01a.png",
                "priority": 2,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2001030",
                "categoryName": "클렌징/필링",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/c0ac405e-7ac1-499e-a58a-4918d5cd44d9.png",
                "priority": 3,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2001033",
                "categoryName": "마스크팩",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/b9de65ee-e31d-4539-813b-9c3364491708.png",
                "priority": 4,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2001034",
                "categoryName": "향수/화장품세트",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/c8c48a31-e122-4b36-8c4c-a81dbfcfa4c6.png",
                "priority": 5,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2001003",
                "categoryName": "이미용가전",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/b641e2c7-7a92-4387-a3d7-7ad4366eb656.png",
                "priority": 5,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2001035",
                "categoryName": "남성화장품",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/cd23ed21-dfa9-4ede-b743-d1d88f37e33e.png",
                "priority": 6,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2001073",
                "categoryName": "헤어케어/스타일링",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/9e92fdec-d97e-4438-9347-efeeeb5d99e5.png",
                "priority": 7,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2002073",
                "categoryName": "바디케어",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/2777d03a-8e70-4ad2-990b-2a8ef05fd4e8.png",
                "priority": 8,
                "subCategories": []
            }
        ]
    },
    {
        "categoryType": "LARGE",
        "categoryNo": "1001008",
        "categoryName": "패션/의류",
        "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/4bc52ea6-a938-4f26-8bb2-46d6229dc10f.png",
        "priority": 11,
        "subCategories": [
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2000048",
                "categoryName": "여성의류",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/f7204728-f415-40f7-93fe-b6c32eed0e92.png",
                "priority": 1,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2001043",
                "categoryName": "남성의류",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/00d27d41-fefc-4ad4-9935-6b4e975bf3e4.png",
                "priority": 2,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2002074",
                "categoryName": "유아동의류",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/8366b765-5b2d-4301-ba66-9202f17162f8.png",
                "priority": 3,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2001044",
                "categoryName": "신발",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/b3da88ca-fe2b-409d-b2b2-1648b4416eaa.png",
                "priority": 4,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2001045",
                "categoryName": "가방/잡화",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/6230eec7-0733-46fa-a70b-399f4c3bf67d.png",
                "priority": 4,
                "subCategories": []
            }
        ]
    },
    {
        "categoryType": "LARGE",
        "categoryNo": "1001005",
        "categoryName": "자동차/레저",
        "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/3bf7e714-1944-468c-bfff-948a318cf3b9.png",
        "priority": 12,
        "subCategories": [
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2001020",
                "categoryName": "자동차실내용품",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/feccd60c-5b5c-4ff6-af9c-f1c5e4d52d5f.png",
                "priority": 1,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2001022",
                "categoryName": "차량용품/타이어",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/be19f940-26a1-48c9-a6fc-6ec850f1be97.png",
                "priority": 2,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2001024",
                "categoryName": "휘트니스/수영",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/7637f9e6-a0c1-4cc2-aed4-8b9cacb60edf.png",
                "priority": 3,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2001027",
                "categoryName": "구기/라켓/골프",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/63166671-dd3a-4a13-bd84-8c8301d23453.png",
                "priority": 4,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2001026",
                "categoryName": "자전거/보드",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/5ac2de92-8660-4526-a56b-266abec14744.png",
                "priority": 5,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2001021",
                "categoryName": "등산/낚시/캠핑",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/2440c81e-4431-4369-860b-a2abeb72ca0b.png",
                "priority": 6,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2001019",
                "categoryName": "스포츠의류/잡화",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/a7b4341a-33ae-43e3-a458-ca54b1a6381b.png",
                "priority": 12,
                "subCategories": []
            }
        ]
    },
    {
        "categoryType": "LARGE",
        "categoryNo": "1000006",
        "categoryName": "도서",
        "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/d5de826a-2ff3-4586-bc4d-42154ad8b532.png",
        "priority": 13,
        "subCategories": [
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2006095",
                "categoryName": "유아/아동",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/c36b616d-ff33-4648-ad56-22ca0a185928.png",
                "priority": 1,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2007091",
                "categoryName": "문학/인문",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/cd2b8318-428a-485d-acc4-ef887da945c0.png",
                "priority": 2,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2006101",
                "categoryName": "육아/취미",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/fedfcdeb-4188-42a2-93ad-2652c13af94c.png",
                "priority": 3,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2006096",
                "categoryName": "경제/경영",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/db665dec-06bd-4030-9846-5885a4f6b8cf.png",
                "priority": 3,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2006097",
                "categoryName": "학습/교육",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/9aae44c6-7f3e-4ea1-8441-048d33e1467e.png",
                "priority": 4,
                "subCategories": []
            }
        ]
    },
    {
        "categoryType": "LARGE",
        "categoryNo": "1001010",
        "categoryName": "문구/취미",
        "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/3f9edddb-e3fc-4c03-aece-56769e03d5e8.png",
        "priority": 14,
        "subCategories": [
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2001053",
                "categoryName": "오피스용품",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/a8e69200-1d40-461c-b4b8-02fbe59a9309.png",
                "priority": 1,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2001054",
                "categoryName": "필기용품",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/4379f5a4-45ba-483a-977a-97963a17be8d.png",
                "priority": 2,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2001055",
                "categoryName": "노트/제지류",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/e9d60796-b3d3-48d3-a7b9-44900b96dc9a.png",
                "priority": 3,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2001059",
                "categoryName": "앨범/다이어리",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/bfd38288-b7b1-4d73-be62-0e516dcd7085.png",
                "priority": 4,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2001057",
                "categoryName": "미술/제도용품",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/1b3e05f2-8a52-4c25-80ac-4c959d2868ce.png",
                "priority": 5,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2001060",
                "categoryName": "선물/포장",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/393e37cb-70ec-4d7e-89a1-3872329305fc.png",
                "priority": 6,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2001063",
                "categoryName": "악기/꽃/취미",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/57f9c606-3933-4fff-8e81-a73df87bb568.png",
                "priority": 7,
                "subCategories": []
            }
        ]
    },
    {
        "categoryType": "LARGE",
        "categoryNo": "1001011",
        "categoryName": "반려동물용품",
        "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/d257d79c-c8e6-4b80-bacc-aa60bf83b12f.png",
        "priority": 15,
        "subCategories": [
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2001064",
                "categoryName": "강아지용품",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/96dda73b-b5f8-4a0e-a8e2-222e3e965665.png",
                "priority": 1,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2001065",
                "categoryName": "고양이용품",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/80f7f6ff-d335-40af-89ce-a9ba37485e1b.png",
                "priority": 2,
                "subCategories": []
            },
            {
                "categoryType": "MIDDLE",
                "categoryNo": "2001066",
                "categoryName": "기타 반려동물용품",
                "categoryImageUrl": "http://image.gmarket.co.kr/hanbando/202404/b2fe41e7-e979-4a0e-aba4-7b3213db5a66.png",
                "priority": 3,
                "subCategories": []
            }
        ]
    }
];

function flattenCategories(categories) {
    const result = [];

    function processCategory(category, parentPriority = null, parentCategoryName = null) {
        const flatCategory = {
            categoryType: category.categoryType,
            categoryNo: category.categoryNo,
            categoryName: category.categoryType === 'MIDDLE' ? parentCategoryName + " > " + category.categoryName : category.categoryName,
            categoryPriority: parentPriority || category.priority,
            subCategoryPriority: parentPriority ? category.priority : null
        };

        result.push(flatCategory);

        if (category.subCategories && category.subCategories.length > 0) {
            category.subCategories.forEach(subCategory => {
                processCategory(subCategory, category.priority, category.categoryName);
            });
        }
    }

    categories.forEach(category => processCategory(category));

    return result;
}

async function main() {
    const flatCategories = flattenCategories(categories);

    let newCategories = [];

    for (const flatCategory of flatCategories) {
        newCategories.push(flatCategory);
        if (flatCategory.categoryType !== 'MIDDLE') {
            continue;
        }

        if (flatCategory.categoryName.includes("빠른장보기")) continue;

        // 조회
        let data =await  (await fetch("https://www.gmarket.co.kr/n/smiledelivery/category?categoryCode="+flatCategory.categoryNo, {
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
                "Referer": "https://www.gmarket.co.kr",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": null,
            "method": "GET"
        })).text();

        const $ = cheerio.load(data);
        let listItems = $('#container > div.wrap__body > div.wrap__filter > ul > li.wrap__filter-item.category.active > div > ul.list__items');

        for (const li of listItems) {
            const catLi = $(li);
            if (flatCategory.categoryName.includes(catLi.text())) continue;
        }
    }
}


main();