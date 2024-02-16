import { makeStyles } from "@mui/styles";
import theme from 'theme';

const useStyles = makeStyles(() => (
    {
        sidePanel: {
            marginTop: '10px',
            height: '105vh', 
            width: '20%',
            color: 'white',
            border: '2px solid rgba(89, 149, 192, 0.5)',
            borderRadius: '18px',
            background: 'rgba(48, 130, 164, 0.1)',
            boxShadow: '3px 3px 3px 3px rgba(0,0,0,0.75)',
            backdropFilter: 'blur(5.1px)',
            WebkitBackdropFilter: 'blur(5.1px)',
            overflowY: 'auto',
        },
        panelCard: {
            display: 'flex', 
            width: '18vw',
            height: '11vh', 
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            borderRadius: '8px',
            backgroundColor: '#282828',
            boxShadow: '1px 1px 1px 1px rgba(0,0,0,0.75)',
            opacity: '0.8',
            '&:hover, &:active, &.MuiFocusVisible': {
                border: '2px solid rgba(89, 149, 192, 0.5)',
                background: 'rgba(48, 130, 164, 0.1)',
                boxShadow: '3px 3px 3px 3px rgba(0,0,0,0.75)',
                backdropFilter: 'blur(5.1px)',
                WebkitBackdropFilter: 'blur(5.1px)',
            },
        },
        playlistField: {
            width: '100%',
            [theme.breakpoints.down('md')]: {
            width: '100%',
            },
            backgroundColor: '#30313d',
            borderRadius: '8px',
            boxShadow: '1px 1px 1px 1px rgba(0,0,0,0.75)',
        },
        currentPlaylistUl: {
            margin: '0 5% 0 0',
            listStyle: 'none',
        },
    }
));

export default useStyles;