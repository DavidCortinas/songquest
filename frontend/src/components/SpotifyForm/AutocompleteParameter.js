import { getCode, getCountry } from "iso-3166-1-alpha-2";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { 
    getSpotifyGenres, 
    getSpotifyMarkets, 
    getSpotifySearchResult 
} from "../../thunks";
import { Autocomplete, Box, TextField } from "@mui/material";

const root = {
  "& .MuiAutocomplete-option[data-focus='true']": {
    backgroundColor: '#40444d',
    color: 'white',
  },
  "& .MuiAutocomplete-option:hover": {
    backgroundColor: '#40444d',
    color: 'white',
  },
};

export const AutocompleteParameter = ({
    parameter, 
    handleChange, 
    classes, 
    invalidSearch, 
    accessToken,
    expiresAt,
    tracks,
    artists,
    genres,
    markets,
    targetParamValues,
    setTargetParamValues,
    onSelectedOptions,
}) => {
    const dispatch = useDispatch();
    const [song, setSong] = useState('');
    const [performer, setPerformer] = useState('');
    const [genre, setGenre] = useState('');
    const [market, setMarket] = useState('');


    const handleOptionSelect = (selectedValue) => {
        const selectedOption = options.find(option => 
          option.id === selectedValue.id
        );

        if (selectedOption) {
          const totalSelectedValues = Object.values(targetParamValues).reduce((total, array) => total + array.length, 0);

          if (totalSelectedValues < 5 && !Object.values(targetParamValues).flat().includes(selectedOption.label)) {
              
              setTargetParamValues(prevValues => ({
                  ...prevValues,
                  [parameter]: [...prevValues[parameter], selectedOption.label],
              }));

            if (parameter === 'songs') {
                setSong(selectedOption.label);
                handleChange(parameter, selectedOption.id);
              } else if (parameter === 'performers') {
                setPerformer(selectedOption.label);
                handleChange(parameter, selectedOption.id);
            } else if (parameter === 'genres') {
                setGenre(selectedOption.label);
                handleChange(parameter, selectedOption.label);
            } else {
                setMarket(selectedOption.label);
                handleChange(parameter, getCode(selectedOption.label));
            }
          }
        }
        const selectedOptions = [...targetParamValues[parameter], selectedOption?.label];
        onSelectedOptions(parameter, selectedOptions)
    };

    useEffect(() => {
        if (song) {
            dispatch(getSpotifySearchResult(song, parameter, accessToken, expiresAt));
        };
        if (performer) {
            dispatch(getSpotifySearchResult(performer, parameter, accessToken, expiresAt));
        };
        if (genre) {
          dispatch(getSpotifyGenres(accessToken, expiresAt));
        };
        if (market) {
          dispatch(getSpotifyMarkets(accessToken, expiresAt));
        };
    }, [song, performer, genre, market]);

    const options = parameter === 'songs' 
      ? tracks.items.map((item) => ({
        id: item.id,
        label: `${item.name} - ${item.artists[0].name}`,
        image: item.album.images[2].url
      }))
      : parameter === 'performers'
      ? artists.items.map((item) => ({
        id: item.id,
        label: item.name,
        image: item.images[2]?.url
      }))
      : parameter === 'genres'
      ? genres.map((genre, index) => ({
        id: `genre_${index}`,
        label: genre,
      }))
      : markets.map((market, index) => ({
        id: `markets_${index}`,
        label: getCountry(market),
      }));

    const filteredOptions = options.filter(option =>
      !Object.values(targetParamValues).flat().includes(option.label)
      );

    return (
      <>
        <Autocomplete
          multiple
          filterSelectedOptions
          onChange={(e, newInputValues) => {
              const newInputValue = newInputValues[newInputValues.length - 1]
              if (newInputValue) {
                  handleOptionSelect(newInputValue);
              }
          }}
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          options={filteredOptions}
          ListboxProps={{ sx: root }}
          renderOption={(props, option) => {
            return (
              <Box 
                component="li" 
                sx={{
                  justifyContent: 'space-between',
                  background: '#30313d',
                  color: 'white',
                }} 
                {...props}>
                  {option.image && <img
                      loading="lazy"
                      width="40"
                      src={option.image}
                      alt=""
                  />}
                  {option.label}
              </Box>
          )}}
          freeSolo
          ChipProps={{ 
            sx: {
              color: {
                color: 'white',
                backgroundColor: '#006f96',
                '& .MuiChip-deleteIcon': {
                  color: 'white',
                },
              '& .MuiChip-deleteIcon:hover': {
                color: '#00435a',
              },
              
            }}
          }}
          className={classes.textField}
          renderInput={(params) => (
              <TextField
                  {...params} 
                  label={parameter === 'songs' 
                    ? 'Select Songs' 
                    : parameter === 'performers'
                    ? 'Select Artists'
                    : parameter === 'genres' 
                    ? 'Select Genres'
                    : 'Select Market'
                  }
                  value={parameter === 'songs' 
                    ? song 
                    : parameter === 'performers'
                    ? performer
                    : parameter === 'genres'
                    ? genre
                    : market
                  }
                  onChange={
                    parameter === 'songs' 
                    ? (e) => setSong(e.target.value)
                    : parameter === 'performers'
                    ? (e) => setPerformer(e.target.value)
                    : parameter === 'genres'
                    ? (e) => setGenre(e.target.value)
                    : (e) => setMarket(e.target.value)
                  }
                  variant='standard'
                  InputLabelProps={{
                    sx: {
                      paddingLeft: '1em',
                      backgroundColor: '#30313d',
                      color: 'white',
                    },
                  }}
                  InputProps={{
                    ...params.InputProps,
                    sx: {
                      ...params.InputProps.sx,
                      paddingLeft: '1em',
                      color: 'white',
                      '& .MuiInputBase-input': {
                        color: 'white', 
                      },
                    },
                  }}
              />
          )}
        />
      </>
    );
};