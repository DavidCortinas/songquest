import { makeStyles } from "@mui/styles";
import theme from "../theme";
import { Alert, Box, Button, Card, CardHeader, Grid, Snackbar, TextField, Typography, useMediaQuery } from "@mui/material";
import { useForm } from "react-hook-form";
import { useCallback, useRef, useState } from "react";
import { connect, useDispatch } from "react-redux";
import AudioFileIcon from '@mui/icons-material/AudioFile';
import { useDropzone } from 'react-dropzone';
import 'react-dropzone-uploader/dist/styles.css'
import Dropzone from 'react-dropzone-uploader'
import { LoadingState } from "./LoadingState";
import { clearSearchSongError, searchSongSuccess } from "../actions";
import { handleUpload, searchSongRequest } from "../thunks";

const useStyles = makeStyles(() => (
  {
  card: {
    backgroundColor: "white",
    justifyContent: 'center',
    display: 'flex',
    width: '100%',
    marginTop: '2rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    color: "#007fbf",
    backgroundColor: "white",
  },
  textField: {
    width: '300px',
    [theme.breakpoints.down('sm')]: {
      width: '40%',
    },
    [theme.breakpoints.down('xs')]: {
      width: '50%',
    },
    backgroundColor: 'white',
    borderRadius: '5px',
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
    // marginTop: '1rem',
  },
  uploader: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingTop: '1rem',
    height: '100%',
    alignItems: 'center',
    color: 'white',
  },
  uploaderBox: {
    borderStyle: 'dashed',
    borderColor: '#006f96',
    borderRadius: '5px',
    // cursor: 'pointer',
  },
  button: {
    color: '#295971',
    marginTop: '3px',
  },
  noBottomLine: {
    borderBottom: 'none',
  },
  audioIcon: {
    marginRight: '5px',
    marginBottom: '10px',
    color: '#006f96',
  },
}));

const Uploader = () => {
    const classes = useStyles()

    const [fileList, setFileList] = useState(null);
    console.log(fileList)
    const [shouldHighlight, setShouldHighlight] = useState(false);

    const preventDefaultHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const fileInputRef = useRef(null);

    const openFileBrowser = () => {
        console.log('Pre')
        fileInputRef.current.click();
        console.log('Post')
    };

    const handleUpload = async (filelist) => {
        const UPLOAD_URL = "/api/upload";
        const data =new FormData();
        for (let file of filelist) {
            data.append(file.name, file);
        }
        console.log('filelist: ', filelist)
        fetch(UPLOAD_URL, data)
        }

    return (
        <div 
            className={classes.uploaderBox}
            onDragOver={(e) => {
                preventDefaultHandler(e);
                setShouldHighlight(true);
            }}
            onDragEnter={(e) => {
                preventDefaultHandler(e);
                setShouldHighlight(true);
            }}
            onDragLeave={(e) => {
                preventDefaultHandler(e);
                setShouldHighlight(false);
            }}
            onDrop={(e) => {
                preventDefaultHandler(e);
                const files = Array.from(e.dataTransfer.files);
                setFileList(files);
                setShouldHighlight(false);
            }}
            onClick={openFileBrowser} 
        >
            <div className={classes.uploader}>
                {!fileList ? (
                    <>
                        <AudioFileIcon  fontSize="large" className={classes.audioIcon} />
                        <Typography variant="body1" marginBottom='15px' color='#006f96'>
                            Choose a file or drop the track here
                        </Typography>
                    </>
                ) : (
                    <>
                        <Typography 
                            variant="h6" 
                            marginBottom='10px'
                            color='#18395c'
                        >
                            Files to Upload
                        </Typography>
                        {fileList.map((file, i) => {
                            return (
                                <Typography 
                                    variant="body1" 
                                    marginBottom='5px'
                                >
                                    {file.name}
                                </Typography>
                                );
                        })}
                        <div className={classes.button}>
                            <button onClick={() => handleUpload(fileList)}>
                                Upload
                            </button>
                            <button
                                className={classes.button}
                                onClick={() => {
                                setFileList(null);
                                }}
                            >
                                Clear
                            </button>
                        </div>
                    </>
                )}
                <input
                    ref={fileInputRef}
                    type="file"
                    style={{ display: "none" }}
                    onChange={(e) => {
                    // Handle file selection
                    const file = e.target.files[0];
                    // Process the selected file
                    }}
                />
            </div>
        </div>
    )
}

export const SongDetector = ({ error, onSearchPressed, onDataLoaded }) => {
  const isXsScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isMdScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isLgScreen = useMediaQuery(theme.breakpoints.between('lg', 'xl'));
  const isXlScreen = useMediaQuery(theme.breakpoints.up('xl'));

  const classes = useStyles();

  return (
    <>
      <Box display="flex" justifyContent="center" paddingTop='1rem'>
        <Box width={isMdScreen || isSmScreen || isXsScreen ? "75%" : "50%"}>
          <Card className={classes.card}>
            <form className={classes.form}>
                <CardHeader
                  title="Song Detector"
                  titleTypographyProps={{
                    width: isSmScreen ? '100%' : '28rem',
                    variant: isSmScreen || isXsScreen
                    ? 'h6'
                    : 'h5',
                    textAlign: 'center',
                    color: 'black',
                  }}
                  subheader={!isXsScreen && "Drop the track in the uploader below or click the button to browse through your local directory"}
                  subheaderTypographyProps={{ 
                    width: isSmScreen || isXsScreen ? '100%' : '28rem', 
                    variant: isXlScreen || isLgScreen 
                      ? 'body1'
                      : 'body2',
                    textAlign: 'center',
                    color: 'black',
                    }}
                />
                <div className={classes.uploadButton}>
                    <Uploader />
                </div>
                <br />
                <br />
            </form>
          </Card>
        </Box>
      </Box>
      {/* Snackbar for displaying errors */}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    songData: state.song.songData,
    query: state.song.query || {},
    error: state.song.error,
  };
};

const mapDispatchToProps = (dispatch) => ({
  onSearchPressed: (query) => dispatch(searchSongRequest(query)),
  onDataLoaded: (songData, query) =>
    dispatch(searchSongSuccess(songData, query)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SongDetector);