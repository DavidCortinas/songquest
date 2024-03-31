import theme from '../../theme'
import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles(() => (
  {
  card: {
    backgroundColor: "transparent",
    justifyContent: 'center',
    display: 'flex',
    width: '100%',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    color: "#007fbf",
    backgroundColor: "transparent",
  },
  box: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    color: "#007fbf",
    backgroundColor: "transparent",
    marginBottom: '5%',
  },
  textField: {
    width: '300px',
    [theme.breakpoints.down('sm')]: {
      width: '80%',
    },
    input: {
        color: 'white',
    },
    backgroundColor: '#30313d',
    color: 'white',
    borderRadius: '8px',
    boxShadow: '1px 1px 1px 1px rgba(0,0,0,0.75)',
  },
  subHeader: {
    width: '40%',
    [theme.breakpoints.up('sm')]: {
      width: '25rem',
    },
  },
  description: {
    maxWidth: theme.breakpoints.up('xl') ? '65rem' : '50rem',
    color: '#6f6f71',
    paddingTop: '1rem',
  },
  buttonsContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '1rem',
  },
  button: {
    color: 'white'
  },
  noBottomLine: {
    borderBottom: 'none',
  }
}));