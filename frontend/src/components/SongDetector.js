import { makeStyles } from "@mui/styles";
import theme from "../theme";
import { Box, Button, Card, CardHeader, Typography, useMediaQuery } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import AudioFileIcon from '@mui/icons-material/AudioFile';
import { useDropzone } from 'react-dropzone';
import classNames from "classnames";
import 'react-dropzone-uploader/dist/styles.css';
import { searchSongSuccess } from "../actions";
import { searchSongRequest } from "../thunks";

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
    borderColor: '#b9ced5',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  highlight: {
    borderStyle: 'dashed',
    borderColor: '#006f96',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  button: {
    margin: '3px 0',
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
  const classes = useStyles();
  const [fileList, setFileList] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const getAudioDuration = (file) => {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.addEventListener("loadedmetadata", () => {
        resolve(audio.duration);
      });
      audio.addEventListener("error", (error) => {
        console.error("Error loading audio:", error);
        reject(error);
      });

      audio.src = URL.createObjectURL(file);
    });
  };

  const handleUpload = async (files) => {
    const UPLOAD_URL = "/api/upload/";
    const data = new FormData();
    for (let file of files) {
      data.append("audio_file", file);
      data.append('title', file.name);
      data.append('artist', 'artist');
      try {
        const audioDuration = await getAudioDuration(file);
        data.append("duration", audioDuration.toString());
      } catch (error) {
        console.error("Error getting audio duration: ", error);
      }
      data.append('to_license', 'false');
      data.append('to_detect', 'true');
    }
    
    // console.log("filelist: ", files);
    // Log the key-value pairs in the FormData
    for (let pair of data.entries()) {
      // console.log(pair[0] + ', ' + pair[1]);
    }

    const options = {
    method: "POST",
    body: data,
    // headers: {
    //   "Content-Type": "multipart/form-data", // Set the correct Content-Type
    // },
  };

  try {
    const response = await fetch(UPLOAD_URL, options);
    if (response.ok) {
      console.log("Upload successful");
      // Handle success
    } else {
      console.error("Upload failed:", response.statusText);
      // Handle error
    }
  } catch (error) {
    console.error("Upload error:", error);
    // Handle error
  }
  };

  const handleDrop = (droppedFiles) => {
    setFileList(droppedFiles);
    setIsDragging(false);
  };

  const preventDefaultHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop: handleDrop });

  return (
    <div
      {...getRootProps({
        onClick: fileList ? preventDefaultHandler : undefined,
        onDragOver: () => setIsDragging(true),
        onDragEnter: () => setIsDragging(true),
        onDragLeave: () => setIsDragging(false),
      })}
      className={classNames(classes.uploaderBox, {
        [classes.highlight]: isDragging,
      })}
    >
      <div className={classes.uploader}>
        {!fileList ? (
          <>
            <AudioFileIcon fontSize="large" className={classes.audioIcon} />
            <Typography variant="body1" marginBottom="15px" color="#006f96">
              Choose a mp3 or wav file or drop the track here
            </Typography>
          </>
        ) : (
          <>
            <Typography variant="h6" marginBottom="10px" color="#18395c">
              Song to Detect
            </Typography>
            {fileList.map((file, i) => (
              <Typography color='black' variant="body1" marginBottom="5px" key={file.name}>
                {file.name}
              </Typography>
            ))}
            <div className={classes.button}>
              <Button onClick={() => handleUpload(fileList)}>Detect</Button>
              <Button
                onClick={() => {
                  setFileList(null);
                }}
              >
                Clear
              </Button>
            </div>
          </>
        )}
      </div>
      <input
        {...getInputProps()}
        type="file"
        style={{ display: "none" }}
      />
    </div>
  );
};


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
                  subheader={!isXsScreen && "Drop the mp3 or wav file in the uploader below or click the button to browse through your local directory"}
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