import * as React from 'react';
import { SnackbarProvider, useSnackbar } from 'notistack';
import {useEffect} from "react";
import uuid from "react-uuid";
import snackbar from "../util/snackbar";
import {IconButton} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

function MyApp() {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    // variant could be success, error, warning, info, or default
    const handleClose = (key) => closeSnackbar(key);

    const action = key => (
        <>
            <IconButton onClick={() => closeSnackbar(key)}>
                <CloseIcon />
            </IconButton>
        </>
    );

    const handleClick = (message, variant) => {
        let key = uuid().toString();
        const options = {variant, key, action, onClick: () => handleClose(key), onDrag: () => handleClose(key) };
        enqueueSnackbar(message, options);
    };

    useEffect(() => {
        snackbar.OpenSnackbarFunc = handleClick;

        return snackbar.clear;
    }, [])

    return '';
}

export default function Snackbar () {

    return (
        <SnackbarProvider maxSnack={3}>
            <MyApp />
        </SnackbarProvider>
    );
}
