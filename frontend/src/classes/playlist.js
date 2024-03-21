import { makeStyles } from "@mui/styles";
import theme from 'theme';

const useStyles = makeStyles(() => (
    {
        sidePanel: {
            marginTop: '10px',
            height: '85vh', 
            width: '20vw',
            color: 'white',
            border: '2px solid rgba(89, 149, 192, 0.5)',
            borderRadius: '18px',
            background: 'rgba(48, 130, 164, 0.15)',
            boxShadow: '3px 3px 3px 3px rgba(0,0,0,0.75)',
            overflowY: 'auto',
            scrollbarWidth: 'thin',
            scrollbarColor: `${theme.palette.primary.analogous1} transparent`,
            WebkitOverflowScrolling: 'touch',
            scrollbarFaceColor: theme.palette.primary.analogous2,
            scrollbarHighlightColor: 'transparent',
            scrollbarShadowColor: 'transparent',
            scrollbarDarkShadowColor: 'transparent',
            [theme.breakpoints.down('lg')]: {
                width: '30vw',
            }
        },
        button: {
            color: 'white',
            backgroundColor: 'rgb(44, 216, 207, 0.3)',
            border: '2px solid rgba(89, 149, 192, 0.5)',
            borderRadius: '18px',
            boxShadow: '1px 1px 3px 3px rgba(0,0,0,0.75)',
            transition: 'border 0.3s, background 0.3s, boxShadow 0.3s',
            '&:hover, &:active, &.MuiFocusVisible': {
                border: '2px solid rgba(89, 149, 192, 0.5)',
                backgroundColor: 'rgb(44, 216, 207, 0.5)',
                boxShadow: '3px 3px 3px 3px rgba(0,0,0,0.75)',
            },
            [theme.breakpoints.down('md')]: {
                padding: '0',
                height: '5%',
                minWidth: '54px'
            },
        },
        actionButton: {
            display: 'flex', 
            width: '18vw',
            height: '11vh', 
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            borderRadius: '18px',
            backgroundColor: '#282828',
            boxShadow: '1px 1px 1px 1px rgba(0,0,0,0.75)',
            opacity: '0.8',
            '&:hover, &:active, &.MuiFocusVisible': {
                border: '2px solid rgba(89, 149, 192, 0.5)',
                background: 'rgba(48, 130, 164, 0.15)',
                boxShadow: '3px 3px 3px 3px rgba(0,0,0,0.75)',
            },
        },
        panelCard: {
            display: 'flex', 
            width: '18vw',
            [theme.breakpoints.down('sm')]: {
                width: '30vw',
            },
            minHeight: 'fit-content', 
            padding: '5% 0',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            borderRadius: '8px',
            backgroundColor: '#282828',
            boxShadow: '1px 1px 1px 1px rgba(0,0,0,0.75)',
            opacity: '0.8',
            '&:hover, &:active, &.MuiFocusVisible': {
                border: '2px solid rgba(89, 149, 192, 0.5)',
                background: 'rgba(48, 130, 164, 0.15)',
                boxShadow: '3px 3px 3px 3px rgba(0,0,0,0.75)',
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
        resetBtn: {
            color: 'white',
            background: `rgb(121, 44, 216, 0.3)`,
            border: '2px solid rgba(89, 149, 192, 0.5)',
            borderRadius: '18px',
            boxShadow: '1px 1px 3px 3px rgba(0,0,0,0.75)',
            transition: 'border 0.3s, background 0.3s, boxShadow 0.3s',
            '&:hover, &:active, &.Mui-focusVisible': {
              background: `rgb(121, 44, 216, 0.5)`,
              boxShadow: '3px 3px 3px 3px rgba(0,0,0,0.75)',
            },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '3%',
            marginTop: '5%',
            minHeight: 'fit-content',
            width: '100%'
        },
    }
));

export default useStyles;