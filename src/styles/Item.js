import {styled} from "@mui/material/styles";
import {Box} from "@mui/material";

export default styled(Box)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));
