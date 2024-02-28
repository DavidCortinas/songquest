import { getCode, getCountry } from "iso-3166-1-alpha-2";
import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { 
    getSpotifyGenres, 
    getSpotifyMarkets, 
    getSpotifySearchResult 
} from "../../thunks";
import { Autocomplete, Box, TextField } from "@mui/material";
import theme from "theme";

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

const AutocompleteParameter = ({
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
  localSelectedOptions,
  setLocalSelectedOptions,
}) => {
  const dispatch = useDispatch();
  const [song, setSong] = useState('');
  const [performer, setPerformer] = useState('');
  const [genre, setGenre] = useState('');
  const [market, setMarket] = useState('');
  const [options, setOptions] = useState([]);

  const handleOptionSelect = useCallback((selectedValue) => {
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

    setLocalSelectedOptions(prevValues => {
      const updatedValues = {
        ...prevValues,
        [parameter]: [...(prevValues[parameter] || []), selectedOption?.label],
      };

      return updatedValues;
    });
      onSelectedOptions(parameter, prevValues => ([...prevValues, selectedOption?.label]));
  }, [options, targetParamValues, parameter, handleChange, onSelectedOptions]);

  const debouncedSearch = debounce((searchTerm) => {
    dispatch(getSpotifySearchResult(searchTerm, parameter, accessToken, expiresAt))
  }, 150);

  useEffect(() => {
    // Clear current options before making a new search
    setOptions([]);

    if (song) {
      debouncedSearch(song);
    };
    if (performer) {
      debouncedSearch(performer);
    };
    if (genre) {
      dispatch(getSpotifyGenres(accessToken, expiresAt));
    };
    if (market) {
      dispatch(getSpotifyMarkets(accessToken, expiresAt));
    };
  }, [song, performer, genre, market]);

  useEffect(() => {
    // Update options when the relevant data changes
    setOptions(parameter === 'songs' ? 
      tracks.items.map((item) => ({
        id: item.id,
        label: `${item.name} - ${item.artists[0].name}`,
        image: item.album.images[2].url
      })) : parameter === 'performers' ? 
      artists.items.map((item) => ({
        id: item.id,
        label: item.name,
        image: item.images[2]?.url
      })) : parameter === 'genres' ? 
      genres.map((genre, index) => ({
        id: `genre_${index}`,
        label: genre,
      })) : markets.map((market, index) => ({
        id: `markets_${index}`,
        label: getCountry(market),
      }))
    );
  }, [parameter, tracks.items, artists.items, genres, markets]);

  const filteredOptions = options.filter(option =>
    !Object.values(targetParamValues).flat().includes(option.label)
  );

  return (
    <>
      <Autocomplete
        multiple
        filterSelectedOptions
        value={localSelectedOptions[parameter] || []}
        onChange={(event, newValue) => {
          newValue.forEach(newOption => {
            const existingOption = targetParamValues[parameter].find(
              o => o.label === newOption.label
            );

            if (!existingOption) {
              handleOptionSelect(newOption);
            }
          });
          setLocalSelectedOptions(prev => ({
            ...prev,
            [parameter]: newValue?.map(option => typeof option === 'string' ? option : option.label),
          }));
          setTargetParamValues(prevValues => ({
            ...prevValues,
            [parameter]: newValue?.map(option => typeof option === 'string' ? option : option.label),
          }));
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
              {...props}
            >
              {option.image && <img
                loading="lazy"
                width="40"
                src={option.image}
                alt=""
              />}
              {option.label}
            </Box>
          )
        }}
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
            }
          }
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
                  fontSize: '0.875rem'
                },
              },
            }}
          />
        )}
      />
    </>
  );
};

export default AutocompleteParameter;