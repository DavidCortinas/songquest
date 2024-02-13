import { makeStyles } from "@mui/styles";
import theme from "theme";

const useStyles = makeStyles(() => (
    {
        accordion: {
            width: '100%',
            borderRadius: '18px',
            overflow: 'hidden',
            paddingTop: '1%'
        },
        inputLabel: {
            overflow: 'hidden',   
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            margin: '0 1em', 
            color: 'white',
        },
        primaryField: {
            width: '50%',
            backgroundColor: '#30313d',
            borderRadius: '8px',
            boxShadow: '1px 1px 1px 1px rgba(0,0,0,0.75)',
            margin: '0 10px 0 0',
            [theme.breakpoints.down('md')]: {
            width: '100%',
            paddingRight: '0',
            margin: '0 0 1em'
            },
        },
        buttonsContainer: {
            display: 'flex',
            justifyContent: 'center',
            paddingTop: '2%',
        },
    }
));

export default useStyles