import {useEffect, useState} from "react";
import {Button, Divider, FormControl, IconButton, Input, InputLabel, List, ListItem, Stack} from "@mui/material";
import Item from "../styles/Item";
import Grid from "@mui/material/Grid2";
import DeleteIcon from "@mui/icons-material/Delete";
import fixedButton from "../styles/fixedButton";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import getCategoryProducts from "../util/eleven";


const list = {
    width: '100%',
    bgcolor: 'background.paper',
    topMargin: '10px'
};

const defaultCategory = {
    no: null
}

const completedList = [];

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
            if (completedList.includes(category.no)) continue;

            const result = getCategoryProducts(category)
            completedList.push(category.no);
        }

        alert("데이터 수집이 완료되었습니다.");
    }

    return (
        <>
            <h1 style={{textAlign: 'center'}}>
                11번가 슈팅배송 랭킹에 있는 상품을 스캔합니다
            </h1>
            <h3 style={{textAlign: 'center'}}>
                스캔할 카테고리 번호를 추가하고 시작 버튼을 눌러주세요
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
                            <Grid size={8}>
                                <Item><h3>카테고리 번호</h3></Item>
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
                                    <Grid size={8}>
                                        <Item>{category.no}</Item>
                                    </Grid>
                                    <Grid size={2}>
                                        <Item>
                                            {
                                                presentLoad === i ? '진행중' : (
                                                    completedList.includes(category.no) ? '완료됨' : '대기중'
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
                                <InputLabel htmlFor="outlined-adornment-amount" shrink={true}>
                                    카테고리 번호
                                </InputLabel>
                                <Input
                                    id="standard-adornment-weight"
                                    value={newCategory.no}
                                    type="number"
                                    onChange={e => setNewCategory({...newCategory, no: Number(e.target.value)})}
                                />
                            </FormControl>
                            <div>
                                <Button variant="contained" onClick={() => {
                                    if (!newCategory.no) return;

                                    console.log("newCategory", newCategory);
                                    console.log("completedList", completedList);

                                    if (completedList.includes(newCategory.no)) {
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
                    loading ? <HourglassTopIcon style={{fontSize: '5rem'}}/> : <PlayArrowIcon style={{fontSize: '5rem'}} onClick={() => {
                        if (loading) return;

                        if (!window.confirm('상품 정보를 수집할까요?')) {
                            return;
                        }

                        setLoading(true);

                        crawlProduct().then(() => setLoading(false))
                    }} />
                }
            </div>
        </>
    )
        ;
}