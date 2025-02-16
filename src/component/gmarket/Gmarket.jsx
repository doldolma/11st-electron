import {useEffect, useRef, useState} from "react";
import {useRecoilState} from "recoil";
import product from "../../atoms/product";
import defaultCategory from "./util/smile_categories";
import getCategoryProducts from "./util/smile";
import StopCircleIcon from '@mui/icons-material/StopCircle';
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
    startPage: 1,
    endPage: 5,
}

const defaultPresentLoad = {
    categoryNo: -1,
}

const pageMin = 1;
const pageMax = 10;

function createCancelToken() {
    return {
        cancelled: false,
    }
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

    // 중지 여부 전송 토큰
    const cancelTokenRef = useRef(null);

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

    const crawlProduct = async (isStop) => {
        for (const category of categories) {
            if (Object.keys(completedList).includes(String(category.no))) continue;

            if (isStop.cancelled) {
                break;
            }

            await getCategoryProducts(category, updatePresentStatus(category.no), isStop)
                .then(result => {
                    if (result) {
                        setCompletedList(c => ({
                            ...c,
                            [category.no + "_" + category.sort]: {
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
                지마켓 스마일배송 상품을 스캔합니다
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
                            <Grid size={1}>
                                <Item><h3>번호</h3></Item>
                            </Grid>
                            <Grid size={4}>
                                <Item><h3>카테고리</h3></Item>
                            </Grid>
                            <Grid size={1}>
                                <Item><h3>정렬</h3></Item>
                            </Grid>
                            <Grid size={1}>
                                <Item><h3>시작페이지</h3></Item>
                            </Grid>
                            <Grid size={1}>
                                <Item><h3>종료페이지</h3></Item>
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
                            <ListItem sx={{width: '100%'}} key={i + category.no}>
                                <Grid container spacing={2} sx={{width: '100%'}}>
                                    <Grid size={1}>
                                        <Item>{category.no}</Item>
                                    </Grid>
                                    <Grid size={4}>
                                        <Item>{category.name}</Item>
                                    </Grid>
                                    <Grid size={1}>
                                        <Item>{sorted.find(s => s.val === category.sort).name}</Item>
                                    </Grid>
                                    <Grid size={1}>
                                        <Item>
                                            {category.startPage}
                                        </Item>
                                    </Grid>
                                    <Grid size={1}>
                                        <Item>
                                            {category.endPage}
                                        </Item>
                                    </Grid>
                                    <Grid size={2}>
                                        <Item>
                                            {
                                                presentLoad.categoryNo === category.no ? presentLoad.load : (
                                                    Object.keys(completedList).includes(String(category.no + "_" + category.sort)) ? '완료됨' : '대기중'
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
                                        <TextField {...params} label="카테고리" variant="standard"/>
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
                                <TextField label="수집 시작페이지" type="number" variant="standard"
                                           value={newCategory.startPage} onChange={e => {
                                    let startPage = Number(e.target.value);
                                    if (startPage < pageMin) startPage = pageMin;
                                    if (startPage > pageMax) startPage = pageMax;
                                    setNewCategory({
                                        ...newCategory,
                                        startPage: startPage
                                    });
                                }}
                                ></TextField>
                                <TextField label="수집 종료페이지" type="number" variant="standard" value={newCategory.endPage}
                                           onChange={e => {
                                               let endPage = Number(e.target.value);
                                               if (endPage < pageMin) endPage = pageMin;
                                               if (endPage > pageMax) endPage = pageMax;
                                               setNewCategory({
                                                   ...newCategory,
                                                   endPage: endPage
                                               })
                                           }}></TextField>
                            </FormControl>
                            <div style={{textAlign: 'center', marginTop: '0.5rem'}}>
                                <Button variant="contained" onClick={() => {
                                    if (!newCategory || !newCategory.no || !newCategory.sort || !newCategory.startPage || !newCategory.endPage) {
                                        return;
                                    }
                                    if (Object.keys(completedList).includes(newCategory.no + "_" + newCategory.sort)) {
                                        alert('이미 완료된 카테고리입니다');
                                        return;
                                    }

                                    if (categories.find(category => (category.no + "_" + category.sort) === (newCategory.no + "_" + newCategory.sort))) {
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
                        </> : (loading ? '' :
                            <Button variant="contained" sx={{mt: '1rem'}} onClick={() => setAddFlag(true)}>카테고리 추가
                            </Button>)
                    }
                </div>
            </Stack>
            <div style={fixedButton}>
                {
                    loading ? <StopCircleIcon style={{fontSize: '5rem'}} onClick={() => {
                            if (!loading) return;
                            if (!window.confirm("작업을 중지할까요?")) {
                                return;
                            }

                            if (cancelTokenRef.current) {
                                cancelTokenRef.current.cancelled = true;
                            }
                        }}/> :
                        <PlayArrowIcon style={{fontSize: '5rem'}} onClick={() => {
                            if (loading) return;

                            if (!window.confirm('상품 정보를 수집할까요?')) {
                                return;
                            }

                            cancelTokenRef.current = createCancelToken();
                            setLoading(true);

                            crawlProduct(cancelTokenRef.current).then(() => setLoading(false))
                        }}/>
                }
            </div>
        </>
    )
        ;
}