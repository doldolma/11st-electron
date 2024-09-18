import {Button, Divider, FormControl, IconButton, List, ListItem, MenuItem, Stack, TextField} from "@mui/material";
import Grid from "@mui/material/Grid2";
import Item from "../../styles/Item";
import fixedButton from "../../styles/fixedButton";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import {useEffect, useState} from "react";
import {useRecoilState} from "recoil";
import product from "../../atoms/product";
import minishopSort from "./util/minishopSort";
import DeleteIcon from "@mui/icons-material/Delete";
import getMinishopProduct from "./util/getMiniShopProduct";


const list = {
    width: '100%',
    bgcolor: 'background.paper',
    topMargin: '10px'
};

const defaultPresentLoad = {
    customerId: "",
}

const emptyCustomer = {
    customerId: '',
    sort: {
        name: "G마켓랭킹순",
        code: "FocusRank",
    },
};

export default function GmarketMinishop() {

    // 판매자 목록
    const [customers, setCustomers] = useState([]);

    // 신규 판매자 상태
    const [addFlag, setAddFlag] = useState(false);

    // 신규 판매자
    const [newCustomer, setNewCustomer] = useState(emptyCustomer);

    // 현재 작업 중인 판매자
    const [presentLoad, setPresentLoad] = useState(defaultPresentLoad);

    // 크롤링 진행 중 여부
    const [loading, setLoading] = useState(false);

    // 스캔 완료된 목록
    const [completedList, setCompletedList] = useRecoilState(product);

    useEffect(() => {
        if (loading) {
            setAddFlag(false);
            setNewCustomer(emptyCustomer);
        }
    }, [loading]);


    const handleDelete = (i) => (e) => {
        e.stopPropagation();
        setCustomers(customers.filter((_, index) => index !== i));
    }

    const updatePresentStatus = (customerId) => (load) => {
        setPresentLoad({
            customerId: customerId,
            load: load,
        });
    }

    const crawlProduct = async () => {
        for (const customer of customers) {
            if (Object.keys(completedList).includes(String(customer.customerId))) continue;

            await getMinishopProduct(customer, updatePresentStatus(customer.customerId))
                .then(result => {
                    if (result) {
                        setCompletedList(c => ({
                            ...c,
                            [customer.customerId]: {
                                type: "minishop",
                                market: 'gmarket',
                                category: {},
                                customer: customer,
                                date: Date.now(),
                                products: result
                            }
                        }));
                    }
                }).catch(e => {
                    alert('상품 정보를 수집하는 중 오류가 발생했습니다.');
                    setPresentLoad(defaultPresentLoad);
                    console.error(e)
                });
        }

        setPresentLoad(defaultPresentLoad);

        alert("데이터 수집이 완료되었습니다.");
    }


    return (
        <>
            <h1 style={{textAlign: 'center'}}>
                지마켓 미니샵 상품을 스캔합니다
            </h1>
            <h3 style={{textAlign: 'center'}}>
                스캔할 판매자 ID를 입력하고 재생 버튼을 누르면 상품 목록을 스캔합니다.
            </h3>
            <Stack
                direction="column"
                justifyContent="flex-start"
                alignItems="center"
                spacing={4}
            >
                <List sx={list} component="nav">
                    <ListItem sx={{width: '100%'}}>
                        <Grid container spacing={2} sx={{width: '100%'}}>
                            <Grid size={4}>
                                <Item><h3>판매자ID</h3></Item>
                            </Grid>
                            <Grid size={4}>
                                <Item><h3>상품정렬</h3></Item>
                            </Grid>
                            <Grid size={2}>
                                <Item><h3>상태</h3></Item>
                            </Grid>
                            <Grid size={2}>
                                <Item><h3>삭제</h3></Item>
                            </Grid>
                        </Grid>
                    </ListItem>
                    <Divider/>
                    {customers.map((customer, i) => {
                        return (
                            <ListItem sx={{width: '100%'}} key={i+customer.customerId}>
                                <Grid container spacing={2} sx={{width: '100%'}}>
                                    <Grid size={4}>
                                        <Item>{customer.customerId}</Item>
                                    </Grid>
                                    <Grid size={4}>
                                        <Item>{customer.sort.name}</Item>
                                    </Grid>
                                    <Grid size={2}>
                                        <Item>
                                            {
                                                presentLoad.customerId === customer.customerId ? presentLoad.load : (
                                                    Object.keys(completedList).includes(String(customer.customerId)) ? '완료됨' : '대기중'
                                                )
                                            }
                                        </Item>
                                    </Grid>
                                    <Grid size={2}>
                                        <Item>
                                            <IconButton onClick={handleDelete(i)}>
                                                <DeleteIcon/>
                                            </IconButton>
                                        </Item>
                                    </Grid>
                                </Grid>
                            </ListItem>
                        );
                    })}
                </List>
                <div>
                    {
                        addFlag ? <>
                            <FormControl variant="standard" sx={{width: '30ch'}}>
                                <TextField label="판매자 ID" variant="filled" value={newCustomer.customerId} onChange={e => setNewCustomer({
                                    ...newCustomer,
                                    customerId: e.target.value
                                })} />
                                <TextField select label="정렬" variant="filled" value={newCustomer.sort} onChange={e => setNewCustomer({
                                    ...newCustomer,
                                    sort: e.target.value
                                })}>
                                    {minishopSort.map(option => {
                                        return (
                                            <MenuItem key={option.code} value={option}>{option.name}</MenuItem>
                                        );
                                    })}
                                </TextField>
                            </FormControl>
                            <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                                <Button variant="contained" onClick={async () => {
                                    if (!newCustomer || !newCustomer.customerId || !newCustomer.sort) {
                                        alert('모두 입력해주세요');
                                        return;
                                    }

                                    if (customers.find(c => c.customerId === newCustomer.customerId)) {
                                        alert('이미 추가된 판매자입니다.');
                                        return;
                                    }

                                    if (Object.keys(completedList).includes(newCustomer.customerId)) {
                                        alert('이미 스캔된 판매자입니다.');
                                        return;
                                    }

                                    // 존재하는지 판매자 ID 인지 gmarket 접속해봄
                                    let res = await fetch("https://minishop.gmarket.co.kr/" + newCustomer.customerId + "/List?CategoryType=General&SortType=LowestPrice&DisplayType=LargeImage&Page=1&PageSize=10", {
                                        redirect: 'manual',
                                    });

                                    if (res.type === 'opaqueredirect') {
                                        alert('존재하지 않는 판매자 ID입니다.');
                                        return;
                                    } else {
                                        setCustomers([...customers, newCustomer]);
                                        setNewCustomer(emptyCustomer);
                                        setAddFlag(false);
                                    }

                                }}>확인</Button>
                                <Button variant="contained" style={{background: 'red'}}
                                        onClick={() => {
                                            setNewCustomer("")
                                            setAddFlag(false);
                                        }}>취소</Button>
                            </div>
                        </> : (loading ? '' : <Button variant="contained" sx={{ mt: '1rem' }} onClick={() => setAddFlag(true)}>판매자 추가
                        </Button>)
                    }
                </div>
            </Stack>
            <div style={fixedButton}>
                {
                    loading ? <HourglassTopIcon style={{fontSize: '5rem'}}/> :
                        <PlayArrowIcon style={{fontSize: '5rem'}} onClick={() => {
                            if (loading) return;

                            if (!window.confirm('상품 정보를 수집할까요?')) {
                                return;
                            }

                            setLoading(true);

                            crawlProduct().then(() => setLoading(false))
                        }}/>
                }
            </div>
        </>
    );
}