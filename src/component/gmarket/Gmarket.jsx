import {useEffect, useState} from "react";
import {useRecoilState} from "recoil";
import product from "../../atoms/product";
import defaultCategory from "./util/smile_categories";
import getCategoryProducts from "./util/smile";
import {
    Autocomplete,
    Button,
    Divider,
    FormControl,
    IconButton,
    List,
    ListItem,
    MenuItem,
    Stack,
    TextField
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import Item from "../../styles/Item";
import DeleteIcon from "@mui/icons-material/Delete";
import fixedButton from "../../styles/fixedButton";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import sorted from "./util/sorted";

const list = {
    width: '100%',
    bgcolor: 'background.paper',
    topMargin: '10px'
};


const emptyCategory = {
    no: '',
    name: '',
    sort: '8',
}

const defaultPresentLoad = {
    categoryNo: -1,
}

export default function Gmarket() {
    // 카테고리 목록
    const [categories, setCategories] = useState([]);

    // 신규 카테고리 상태
    const [addFlag, setAddFlag] = useState(false);

    // 신규 카테고리
    const [newCategory, setNewCategory] = useState(emptyCategory);

    // 현재 작업 중인 카테고리
    const [presentLoad, setPresentLoad] = useState(defaultPresentLoad);

    // 크롤링 진행 중 여부
    const [loading, setLoading] = useState(false);

    // 스캔 완료된 목록
    const [completedList, setCompletedList] = useRecoilState(product);

    // 카테고리 셀렉트 박스 목록
    const defaultProps = {
        options: defaultCategory,
        getOptionLabel: (option) => option.name,
    }

    useEffect(() => {
        if (loading) {
            setAddFlag(false);
            setNewCategory(emptyCategory);
        }
    }, [loading]);

    const handleDelete = (i) => (e) => {
        e.stopPropagation();
        setCategories(categories.filter((_, index) => index !== i));
    }

    const updatePresentStatus = (categoryNo) => (load) => {
        setPresentLoad({
            categoryNo: categoryNo,
            load: load,
        });
    }

    const crawlProduct = async () => {
        for (const category of categories) {
            if (Object.keys(completedList).includes(String(category.no))) continue;

            await getCategoryProducts(category, updatePresentStatus(category.no))
                .then(result => {
                    if (result) {
                        setCompletedList(c => ({
                            ...c,
                            [category.no]: {
                                market: 'gmarket',
                                category: category,
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
                지마켓 스마일배송  상품을 스캔합니다
            </h1>
            <h3 style={{textAlign: 'center'}}>
                스캔할 카테고리를 선택하고 재생 버튼을 누르면 상품 목록을 스캔합니다.
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
                            <Grid size={2}>
                                <Item><h3>번호</h3></Item>
                            </Grid>
                            <Grid size={4}>
                                <Item><h3>카테고리</h3></Item>
                            </Grid>
                            <Grid size={2}>
                                <Item><h3>정렬</h3></Item>
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
                    {categories.map((category, i) => {
                        return (
                            <ListItem sx={{width: '100%'}} key={i+category.no}>
                                <Grid container spacing={2} sx={{width: '100%'}}>
                                    <Grid size={2}>
                                        <Item>{category.no}</Item>
                                    </Grid>
                                    <Grid size={4}>
                                        <Item>{category.name}</Item>
                                    </Grid>
                                    <Grid size={2}>
                                        <Item>{sorted.find(s => s.val === category.sort).name}</Item>
                                    </Grid>
                                    <Grid size={2}>
                                        <Item>
                                            {
                                                presentLoad.categoryNo === category.no ? presentLoad.load : (
                                                    Object.keys(completedList).includes(String(category.no)) ? '완료됨' : '대기중'
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
                        )
                    })}
                </List>
                <div>
                    {
                        addFlag ? <>
                            <FormControl variant="standard" sx={{width: '30ch'}}>
                                <Autocomplete
                                    {...defaultProps}
                                    id="auto-select"
                                    autoSelect
                                    value={newCategory}
                                    onChange={(e, newValue) => {
                                        setNewCategory({
                                            ...newCategory,
                                            ...newValue,
                                        });
                                    }}
                                    renderInput={(params) => (
                                        <TextField {...params} label="카테고리" variant="standard" />
                                    )}
                                />
                                <TextField select label="정렬" variant="filled" value={newCategory.sort} onChange={e => {
                                    setNewCategory({
                                        ...newCategory,
                                        sort: e.target.value
                                    });
                                }}>
                                    {
                                        sorted.map((sort, i) => {
                                            return (
                                                <MenuItem key={i} value={sort.val}>{sort.name}</MenuItem>
                                            )
                                        })
                                    }
                                </TextField>
                            </FormControl>
                            <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                                <Button variant="contained" onClick={() => {
                                    if (!newCategory || !newCategory.no || !newCategory.sort) {
                                        return;
                                    }
                                    if (Object.keys(completedList).includes(newCategory.no)) {
                                        alert('이미 완료된 카테고리입니다');
                                        return;
                                    }

                                    if (categories.find(category => category.no === newCategory.no)) {
                                        alert('이미 추가된 카테고리입니다');
                                        return;
                                    }

                                    if (newCategory) setCategories([...categories, newCategory]);


                                    setNewCategory(emptyCategory);


                                }}>확인</Button>
                                <Button variant="contained" style={{background: 'red'}}
                                        onClick={() => {
                                            setNewCategory(emptyCategory);
                                            setAddFlag(false);
                                        }}>취소</Button>
                            </div>
                        </> : (loading ? '' : <Button variant="contained" sx={{ mt: '1rem' }} onClick={() => setAddFlag(true)}>카테고리 추가
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
    )
        ;
}