import './App.css';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {useEffect, useMemo, useState} from "react";
import {blue, orange} from "@mui/material/colors";
import {BottomNavigation, BottomNavigationAction, Container, CssBaseline, darkScrollbar, Paper} from "@mui/material";
import Home from "./pages/Home";
import Data from "./pages/Data";
import Setting from "./pages/Setting";
import {RecoilRoot} from "recoil";

function App() {
    const [darkMode, setDarkMode] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);

    const theme = useMemo(() =>
            createTheme({
                palette: {
                    mode: darkMode ? 'dark' : 'light',
                    primary: orange,
                    secondary: blue,
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
        let vh = 0;
        const setVh = () => {
            vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };

        window.addEventListener('resize', setVh)
        setVh()

        return () => {
            window.removeEventListener('resize', setVh)
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
                    {/* 모든 페이지 컴포넌트를 렌더링하되, 현재 페이지만 표시 */}
                    <div style={{display: currentPage === 0 ? 'block' : 'none'}}><Home/></div>
                    <div style={{display: currentPage === 1 ? 'block' : 'none'}}><Data/></div>
                    <div style={{display: currentPage === 2 ? 'block' : 'none'}}><Setting darkMode={darkMode}
                                                                                          setDarkMode={setDarkMode}/>
                    </div>
                    <BottomNav value={currentPage} setValue={setCurrentPage}/>
                </Container>
            </RecoilRoot>
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
                <BottomNavigationAction label="크롤링"/>
                <BottomNavigationAction label="데이터"/>
                <BottomNavigationAction label="앱 설정"/>
            </BottomNavigation>
        </Paper>
    );
}

export default App;