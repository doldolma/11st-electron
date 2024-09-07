import {useRecoilState} from "recoil";
import product from "../atoms/product";
import {useEffect} from "react";
import {IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import saveExcel from "../util/product_excel";
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Data() {

    const [products, setProducts] = useRecoilState(product);

    const excelDown = (categoryNo) => () => {
        let product = products[categoryNo];
        if (!product) return;

        saveExcel(product);
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
                            <TableCell component="th" style={{width: '20%'}}>카테고리 번호</TableCell>
                            <TableCell component="th" style={{width: '30%'}}>카테고리 이름</TableCell>
                            <TableCell component="th" style={{width: '15%'}}>수집일시</TableCell>
                            <TableCell component="th" style={{width: '10%'}}>삭제</TableCell>
                            <TableCell component="th" style={{width: '10%'}}>엑셀다운</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            Object.keys(products).map((key) => {
                                return (
                                    <TableRow key={key}>
                                        <TableCell>{key}</TableCell>
                                        <TableCell>{products[key].category.name}</TableCell>
                                        <TableCell>{new Date(products[key].date).toLocaleString()}</TableCell>
                                        <TableCell>
                                            <IconButton onClick={handleDelete(key)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                        <TableCell>
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
            </TableContainer>
        </>
    );
}