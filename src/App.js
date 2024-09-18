import './App.css';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {useEffect, useMemo, useState} from "react";
import {
    BottomNavigation,
    BottomNavigationAction,
    Button,
    Container,
    CssBaseline,
    darkScrollbar,
    Paper
} from "@mui/material";
import Home from "./pages/Home";
import Data from "./pages/Data";
import Setting from "./pages/Setting";
import {RecoilRoot} from "recoil";
import Gmarket from "./component/gmarket/Gmarket";
import Action from "./component/action/Action";
import Snackbar from "./component/Snackbar";
import snackbar from "./util/snackbar";
import GmarketMinishop from "./component/gmarket/GmarketMinishop";
const { ipcRenderer } = window.require('electron');

function App() {
    const [darkMode, setDarkMode] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);

    const theme = useMemo(() =>
            createTheme({
                palette: {
                    mode: darkMode ? 'dark' : 'light',
                    ochre: {
                        main: '#E3D026',
                        light: '#E9DB5D',
                        dark: '#A29415',
                        contrastText: '#242105',
                    }
                },
                components: {
                    MuiCssBaseline: {
                        styleOverrides: (themeParam) => ({
                            '.app-root': themeParam.palette.mode === 'dark' ? darkScrollbar() : null,
                        }),
                    }
                }
            }),
        [darkMode],
    );

    useEffect(() => {
        // vh 단위 계산
        let vh = 0;
        const setVh = () => {
            vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };

        window.addEventListener('resize', setVh)
        setVh()

        // 업데이트 체크
        ipcRenderer.on('update_available', (_, info) => {
            snackbar.Success(`새 버전 ${info.version}이 사용 가능합니다. 다운로드를 시작합니다.`);
        });

        ipcRenderer.on('update_not_available', () => {
            snackbar.Info('현재 최신 버전을 사용 중입니다.');
        });

        ipcRenderer.on('update_error', (_, err) => {
            snackbar.Error(`업데이트 중 오류가 발생했습니다: ${err.message}`);
        });

        ipcRenderer.on('update_downloaded', () => {
            if (window.confirm('새 버전이 다운로드되었습니다. 지금 재시작하시겠습니까?')) {
                ipcRenderer.send('restart_app');
            }
        });

        return () => {
            window.removeEventListener('resize', setVh);
            ipcRenderer.removeAllListeners('update_available');
            ipcRenderer.removeAllListeners('update_not_available');
            ipcRenderer.removeAllListeners('update_error');
            ipcRenderer.removeAllListeners('update_downloaded');
        }
    }, []);

    useEffect(() => {
        if (darkMode) {
            document.body.classList.add('dark-mode');
            document.body.classList.remove('light-mode');
        } else {
            document.body.classList.add('light-mode');
            document.body.classList.remove('dark-mode');
        }
    }, [darkMode]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <RecoilRoot>
                <Container className="app-root" maxWidth="xl" style={{marginTop: '2rem', marginBottom: '5rem'}}>
                    {/*<Button onClick={() => {*/}
                    {/*    snackbar.Info("테스트");*/}
                    {/*}}>테스트</Button>*/}
                    {/* 모든 페이지 컴포넌트를 렌더링하되, 현재 페이지만 표시 */}
                    <div style={{display: currentPage === 0 ? 'block' : 'none'}}><Home/></div>
                    <div style={{display: currentPage === 1 ? 'block' : 'none'}}><Gmarket /></div>
                    <div style={{display: currentPage === 2 ? 'block' : 'none'}}><GmarketMinishop /></div>
                    <div style={{display: currentPage === 3 ? 'block' : 'none'}}><Action /></div>
                    <div style={{display: currentPage === 4 ? 'block' : 'none'}}><Data/></div>
                    <div style={{display: currentPage === 5 ? 'block' : 'none'}}><Setting darkMode={darkMode}  setDarkMode={setDarkMode}/></div>
                    <BottomNav value={currentPage} setValue={setCurrentPage}/>
                </Container>
            </RecoilRoot>
            <Snackbar/>
        </ThemeProvider>
    );
}

function BottomNav({value, setValue}) {
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Paper sx={{position: 'fixed', bottom: 0, left: 0, right: 0}} elevation={3}>
            <BottomNavigation
                showLabels
                value={value}
                onChange={handleChange}
            >
                <BottomNavigationAction label="11번가"/>
                <BottomNavigationAction label="지마켓"/>
                <BottomNavigationAction label="지마켓-미니샵"/>
                <BottomNavigationAction label="옥션"/>
                <BottomNavigationAction label="데이터"/>
                <BottomNavigationAction label="앱 설정"/>
            </BottomNavigation>
        </Paper>
    );
}

export default App;