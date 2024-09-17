import * as React from 'react';
import { SnackbarProvider, useSnackbar } from 'notistack';
import {useEffect} from "react";
import uuid from "react-uuid";
import snackbar from "../util/snackbar";

function MyApp() {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    // variant could be success, error, warning, info, or default
    const handleClose = (key) => closeSnackbar(key);

    const handleClick = (message, variant) => {
        let key = uuid().toString();
        enqueueSnackbar(message, { variant, key, onClick: () => handleClose(key), onDrag: () => handleClose(key) });
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
