import { 
    FormControl, 
    InputLabel, 
    MenuItem, 
    Select 
} from "@mui/material";
import theme from "theme";

export const SearchParameter = ({ 
    parameter, 
    handleChange, 
    classes, 
    invalidSearch,  
}) => (
        <>
          <FormControl className={classes.resultsField}>
            <InputLabel className={classes.inputLabel} variant='standard' >Results</InputLabel>
            <Select 
              label='Results'
              onChange={(e) => handleChange(parameter, e.target.value)}
              variant="filled"
              sx={{
                '.MuiInputBase-input': { 
                  color: 'white',
                  [theme.breakpoints.down('sm')]: {
                    padding: '3% 2%',
                  }
                },
              }}
              MenuProps={{
                sx: {
                  '.MuiPaper-root': {
                    backgroundColor: '#30313d', 
                    color: 'white',
                  },
                },
              }}
            >
              {Array.from({ length: 100 }, (_, index) => (
                <MenuItem key={index} value={index + 1}>
                  {index + 1}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
      </>
); 