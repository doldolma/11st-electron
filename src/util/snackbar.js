
// variants
const info = 'info', success = 'success', warning = 'warning', error = 'error';

const snackbar = {
    // Snackbar를 띄우는 함수
    OpenSnackbarFunc: undefined,
    OpenSnackbar: function (message, variant) {
        if (this.OpenSnackbarFunc) {
            this.OpenSnackbarFunc(message, variant);
            return true;
        }
        return false;
    },
    clear: () => {
        snackbar.OpenSnackbarFunc = undefined;
    },
    Open: function (message) {
        this.OpenSnackbar(message)
    },
    Error: function (message) {
        this.OpenSnackbar(message, error);
    },
    Success: function(message) {
        this.OpenSnackbar(message, success);
    },
    Info: function (message) {
        this.OpenSnackbar(message, info);
    },
    Warning: function (message) {
        this.OpenSnackbar(message, warning)
    },
    // 중복 스낵이 여러개 발생하는 것을 막기 위해 메세지를 보낼 수 있는 지 체크하는 플래그
    msgAvailable: true,
    OpenExpire: function (message, variant) {
        // 메세지를 보낼 수 있는 지 체크
        if (this.msgAvailable) {
            if (this.OpenSnackbar(message, variant)) {
                // 메세지를 보냈으면 메세지를 보낼 수 없는 상태로 변경
                this.msgAvailable = false;
                // 3초후 메세지를 보낼 수 있도록 상태 변경
                setTimeout(() => this.msgAvailable = true, 3000);
            }
        }
    },
    OpenExp: function (message) {
        this.OpenExpire(message);
    },
    ErrorExp: function(message) {
        this.OpenExpire(message, error);
    },
    SuccessExp: function (message) {
        this.OpenExpire(message, success);
    },
    InfoExp: function (message) {
        this.OpenExpire(message, info)
    },
    WarningExp: function (message) {
        this.OpenExpire(message, warning)
    }
};

export default snackbar
