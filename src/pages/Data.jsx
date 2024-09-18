import {useRecoilState} from "recoil";
import product from "../atoms/product";
import {
    Button,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import saveExcel from "../util/product_excel";
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import saveGmarketExcel from "../component/gmarket/util/saveGamarketExcel";
import saveActionExcel from "../component/action/util/saveActionExcel";

export default function Data() {

    const [products, setProducts] = useRecoilState(product);

    const excelDown = (categoryNo) => () => {
        let product = products[categoryNo];
        if (!product) return;

        switch (product.market) {
            case '11st':
                saveExcel(product);
                break;
            case 'gmarket':
                saveGmarketExcel(product);
                break;
            case 'action':
                saveActionExcel(product);
                break;
            default:
                throw new Error('지원하지 않는 마켓입니다.');
        }
    }

    const handleDelete = (categoryNo) => () => {
        let product = products[categoryNo];
        if (!product) return;

        let newProducts = {...products};
        delete newProducts[categoryNo];
        setProducts(newProducts);
    }

    return (
        <>
            <h1 style={{ textAlign: 'center' }}>
                크롤링 된 카테고리 목록
            </h1>
            <TableContainer component={Paper} style={{marginTop: '10px', width: '100%'}}>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell component="th" style={{width: '10%'}}>마켓</TableCell>
                            <TableCell component="th" style={{width: '15%'}}>카테고리 번호</TableCell>
                            <TableCell component="th" style={{width: '15%'}}>카테고리 이름</TableCell>
                            <TableCell component="th" style={{width: '15%'}}>수집일시</TableCell>
                            <TableCell component="th" style={{width: '10%'}}>상품개수</TableCell>
                            <TableCell component="th" style={{width: '10%', textAlign: 'center'}}>삭제</TableCell>
                            <TableCell component="th" style={{width: '10%', textAlign: 'center'}}>엑셀다운</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            Object.keys(products).map((key) => {
                                return (
                                    <TableRow key={key}>
                                        <TableCell>{products[key].market}</TableCell>
                                        <TableCell>{products[key].type === 'minishop' ? 'minishop' : key }</TableCell>
                                        <TableCell>{products[key].type === 'minishop' ? key : products[key].category.name}</TableCell>
                                        <TableCell>{new Date(products[key].date).toLocaleString()}</TableCell>
                                        <TableCell>{products[key].products.length}</TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>
                                            <IconButton onClick={handleDelete(key)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>
                                            <IconButton onClick={excelDown(key)}>
                                                <DownloadIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        }
                    </TableBody>
                </Table>
                {/*<Button variant='outlined' style={{ float: 'right', marginRight: '3rem' }}>일괄다운</Button>*/}
            </TableContainer>
        </>
    );
}