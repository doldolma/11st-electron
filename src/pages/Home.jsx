import {useEffect, useState} from "react";
import {
    Button,
    Divider,
    FormControl,
    IconButton,
    Input,
    InputLabel,
    List,
    ListItem,
    MenuItem, Select,
    Stack
} from "@mui/material";
import Item from "../styles/Item";
import Grid from "@mui/material/Grid2";
import DeleteIcon from "@mui/icons-material/Delete";
import fixedButton from "../styles/fixedButton";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import getCategoryProducts from "../util/eleven";
import {useRecoilState} from "recoil";
import product from "../atoms/product";
import defaultCategory from '../util/category';


const list = {
    width: '100%',
    bgcolor: 'background.paper',
    topMargin: '10px'
};

export default function Home() {

    // 카테고리 목록
    const [categories, setCategories] = useState([]);

    // 신규 카테고리 상태
    const [addFlag, setAddFlag] = useState(false);

    // 신규 카테고리
    const [newCategory, setNewCategory] = useState(defaultCategory);

    // 현재 작업 중인 카테고리
    const [presentLoad, setPresentLoad] = useState(-1);

    // 크롤링 진행 중 여부
    const [loading, setLoading] = useState(false);

    // 스캔 완료된 목록
    const [completedList, setCompletedList] = useRecoilState(product);

    console.log("keys ", Object.keys(completedList))

    useEffect(() => {
        if (loading) {
            setAddFlag(false);
            setNewCategory('');
        }
    }, [loading]);

    const handleDelete = (i) => (e) => {
        e.stopPropagation();
        setCategories(categories.filter((_, index) => index !== i));
    }

    const crawlProduct = async () => {
        for (const category of categories) {
            if (Object.keys(completedList).includes(String(category.no))) continue;

            getCategoryProducts(category)
                .then(result => {
                    if (result) {
                        setCompletedList(c => ({
                            ...c,
                            [category.no]: {
                                category: category,
                                date: Date.now(),
                                products: result
                            }
                        }));
                    }
                }).catch(e => {
                alert('상품 정보를 수집하는 중 오류가 발생했습니다.');
                console.error(e)
            });
        }

        alert("데이터 수집이 완료되었습니다.");
    }

    return (
        <>
            <h1 style={{textAlign: 'center'}}>
                11번가 슈팅배송 랭킹에 있는 상품을 스캔합니다
            </h1>
            <h3 style={{textAlign: 'center'}}>
                스캔할 카테고리를 선택하고 재생 버튼을 누르면 슈팅배송 목록을 스캔합니다.
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
                                번호
                            </Grid>
                            <Grid size={6}>
                                <Item><h3>카테고리</h3></Item>
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
                            <ListItem sx={{width: '100%'}} key={category.no}>
                                <Grid container spacing={2} sx={{width: '100%'}}>
                                    <Grid size={2}>
                                        {category.no}
                                    </Grid>
                                    <Grid size={6}>
                                        <Item>{category.name}</Item>
                                    </Grid>
                                    <Grid size={2}>
                                        <Item>
                                            {
                                                presentLoad === i ? '진행중' : (
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
                            <FormControl variant="standard" sx={{m: 1, mt: 3, width: '25ch'}}>
                                <InputLabel id="demo-simple-select-standard-label">카테고리</InputLabel>
                                <Select
                                    label='카테고리'
                                    value={newCategory.no}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                >
                                    {defaultCategory.map((c, i) => <MenuItem key={c.no} value={c}>{c.name}</MenuItem>)}
                                </Select>
                            </FormControl>
                            <div>
                                <Button variant="contained" onClick={() => {
                                    if (!newCategory.no) return;

                                    if (Object.keys(completedList).includes(newCategory.no)) {
                                        alert('이미 완료된 카테고리입니다');
                                        return;
                                    }

                                    if (categories.find(category => category.no === newCategory.no)) {
                                        alert('이미 추가된 카테고리입니다');
                                        return;
                                    }

                                    if (newCategory) setCategories([...categories, newCategory]);
                                    setNewCategory({});
                                }}>확인</Button>
                                <Button variant="contained" style={{background: 'red'}}
                                        onClick={() => {
                                            setNewCategory(defaultCategory);
                                            setAddFlag(false);
                                        }}>취소</Button>
                            </div>
                        </> : (loading ? '' : <Button variant="contained" onClick={() => setAddFlag(true)}>카테고리 추가
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