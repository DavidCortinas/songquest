import { 
    Accordion, 
    AccordionDetails, 
    AccordionSummary, 
    Box, 
    Button, 
    Card, 
    Checkbox, 
    Tooltip, 
    Typography 
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';

export const LeftPanel = ({
    classes,
    handleDeletePlaylist,
    playlists,
    getPlaylistItems,
}) => {

    return (
        <Card className={classes.sidePanel}>
          <Box 
            display='flex' 
            alignItems='center' 
            justifyContent='space-between'
            padding='20px 0 20px 20px'
          >
            <Tooltip
              title='Select all playlists'
            >
              <Checkbox sx={{ padding: '0px', color: 'white' }}/>
            </Tooltip>
            <Typography 
              variant='body1' 
              textAlign='center' 
              paddingLeft='20px'
              letterSpacing='2px'
            >
              Your Playlists
            </Typography>
            <Tooltip
              title='Delete selected playlists'
            >
              <Button
                sx={{ padding: '0 0 0 20px'}}
                onClick={() => handleDeletePlaylist()}
              >
                <PlaylistRemoveIcon />
              </Button>
            </Tooltip>
          </Box>
          {playlists.length === 0 ? (
            <>
              <Typography 
                variant='subtitle2' 
                textAlign='center' 
                padding='20px'
                letterSpacing='1px'
              >
                You have not created any playlists. 
              </Typography>
              <Typography 
                variant='subtitle2' 
                textAlign='center' 
                padding='20px'
                letterSpacing='1px'
              >
                Use tokens to create playlists and share your finds. 
              </Typography>
            </>
          ) : playlists.map((playlist) => {
            return (
              <Accordion
                sx={{
                  backgroundColor: 'transparent',
                  color: 'white',
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon color='primary' />}
                >
                  <Box display='flex' alignItems='center'>
                    <Checkbox 
                      onClick={(event) => event.stopPropagation()} 
                      sx={{
                        color: 'white',
                      }}
                    />
                    <Typography marginLeft='5px' variant='body2'>
                      {playlist.name}
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  {getPlaylistItems(playlist)}
                </AccordionDetails>
              </Accordion>
            )
          })}
        </Card>
    )
}