import { Box, Grid, Modal, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { SliderParameter } from "./SliderParameter";
import theme from "theme";

const SliderModal = ({ 
  autocompleteParam,
  parameters, 
  setParameters, 
  query, 
  onSetQueryParameter, 
  openModal, 
  setOpenModal, 
  isXsScreen,
  isSmScreen,
  isMdScreen,
  isLgScreen,
  isXlScreen,
  classes,
}) => {

  return (
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
      >
        <Box
          sx={{
            backgroundColor: 'rgba(13,27,38,0.9)',
            color: 'white',
            border: '2px solid rgba(89, 149, 192, 0.5)',
            borderRadius: '18px',
            overflowY: 'auto',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '70%',
            height: '80%',
            boxShadow: 24,
            p: 4,
          }}
        >
            <Grid container columns={20} spacing={2} paddingBottom='15px'>
              {!(isSmScreen || isXsScreen) && 
                (
                  <Grid item xs={4}>
                    <Typography>Fine Tuning Parameters</Typography>
                  </Grid>
                )
              }
              <Grid item xs={
                isMdScreen || isLgScreen || isXlScreen ?
                16 :
                20
              }> 
                <Box 
                  display='flex' 
                  flexDirection='row' 
                  justifyContent='space-between'
                >
                  <Typography textAlign='start'>Minimum Value</Typography>
                  <Typography textAlign='center'>Target Value</Typography>
                  <Typography textAlign='end'>Maximum Value</Typography>
                </Box>
              </Grid>
            </Grid>
            <Box
              sx={{
                  position: 'absolute',
                  top: '1.5%', 
                  right: '1.5%', 
                  cursor: 'pointer',
              }}
            >
                <CloseIcon 
                    onClick={() => setOpenModal(false)} 
                    style={{ color: theme.palette.primary.triadic2 }}
                />
            </Box>
            {Object.keys(parameters).map((parameter, index) => { 
              return parameter !== 'limit' && !autocompleteParam.includes(parameter) && (
              <SliderParameter
                key={index}
                parameter={parameter}
                setParameters={setParameters}
                query={query}
                onSetQueryParameter={onSetQueryParameter}
                isXsScreen={isXsScreen}
                isSmScreen={isSmScreen}
                isMdScreen={isMdScreen}
                isLgScreen={isLgScreen}
                isXlScreen={isXlScreen}
                classes={classes}
              />
            )})}
          </Box>
      </Modal>
  );
};

export default SliderModal;