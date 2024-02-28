import { Box, FormControlLabel, Slider, Switch, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { toCapitalCase } from "utils";

export const SliderParameter = ({ 
  parameter, 
  query, 
  onSetQueryParameter, 
  setParameters,
  isXsScreen, 
  isSmScreen, 
  isMdScreen, 
  isLgScreen, 
  isXlScreen,
  classes,
}) => {

  const [itemSelected, setItemSelected] = useState(false);

  useEffect(() => {
    if (
      query[parameter]['min'] === null || 
      query[parameter]['target'] === null || 
      query[parameter]['target'] === null
    ) {
      setItemSelected(false);
    };
  }, [query])

  const handleContainerClick = () => {
    setItemSelected((prev) => !prev);
  };

  const min = query && query[parameter]['min'];
  const max = query && query[parameter]['max'];
  const target = query && query[parameter]['target'];

  const marks = parameter === 'time_signature' 
  ? [
    {
      value: 3,
      label: '3/4',
    },
    {
      value: 4,
      label: '4/4',
    },
    {
      value: 5,
      label: '5/4',
    },
    {
      value: 6,
      label: '6/4',
    },
    {
      value: 7,
      label: '7/4',
    },
  ]
  : parameter === 'key'
  ? [
    {
      value: 0,
      label: 'C',
    },
    {
      value: 1,
      label: 'C#',
    },
    {
      value: 2,
      label: 'D',
    },
    {
      value: 3,
      label: 'D#',
    },
    {
      value: 4,
      label: 'E',
    },
    {
      value: 5,
      label: 'F',
    },
    {
      value: 6,
      label: 'F#',
    },
    {
      value: 7,
      label: 'G',
    },
    {
      value: 8,
      label: 'G#',
    },
    {
      value: 9,
      label: 'A',
    },
    {
      value: 10,
      label: 'A#',
    },
    {
      value: 11,
      label: 'B',
    },
  ]
  : [
      {
        value: parameter === 'duration_ms' 
          ? 30000
          : parameter === 'loudness'
          ? -60
          : 0,
        label: parameter === 'duration_ms' 
          ? '30 seconds'
          : parameter === 'loudness'
          ? '-60 db'
          : parameter === 'tempo'
          ? '0 bpm'
          : '0%',
      },
      {
        value: parameter === 'duration_ms' 
          ? 1800000
          : parameter === 'loudness'
          ? -30
          : parameter === 'tempo'
          ? 150
          : parameter === 'mode' || parameter === 'popularity' 
          ? 50
          : 0.5,
        label: parameter === 'duration_ms' 
          ? '30 minutes'
          : parameter === 'loudness'
          ? '-30 db'
          : parameter === 'tempo'
          ? '150 bpm'
          : '50%',
      },
      {
        value: parameter === 'duration_ms' 
          ? 3600000
          : parameter === 'loudness'
          ? 0
          : parameter === 'tempo'
          ? 300
          : parameter === 'mode' || parameter === 'popularity'
          ? 100
          : 1,
        label: parameter === 'duration_ms' 
          ? '1 hr'
          : parameter === 'loudness'
          ? '0 db'
          : parameter === 'tempo'
          ? '300 bpm'
          : '100%',
      },
    ];

  const [parameterValue, setParameterValue] = useState({
    min: min !== null ? min : 0,
    target: max !== null ? max : 50,
    max: target!== null ? target : 100,
  });

  useEffect(() => {
    const min = query && query[parameter] && query[parameter]['min'];
    const max = query && query[parameter] && query[parameter]['max'];
    const target = query && query[parameter] && query[parameter]['target'];

    setParameterValue({
      min: min !== null 
        ? min
        : parameter === 'duration_ms'
        ? 30000
        : parameter === 'time_signature'
        ? 1
        : parameter === 'key'
        ? -1
        : parameter === 'loudness'
        ? -60
        : 0,
      target: target !== null 
      ? target
      : parameter === 'duration_ms'
      ? 1800000
      : parameter === 'key'
      ? 6
      : parameter === 'loudness'
      ? -30
      : parameter === 'mode' || parameter === 'popularity'
      ? 50
      : parameter === 'tempo'
      ? 150
      : parameter === 'time_signature'
      ? 5
      : .50,
      max: max !== null 
        ? max 
        : parameter === 'duration_ms'
        ? 3600000
        : parameter === 'tempo'
        ? 300
        : parameter === 'mode' || parameter === 'popularity'
        ? 100
        : parameter === 'time_signature' || parameter === 'key'
        ? 11
        : parameter === 'loudness'
        ? 0
        : 1,
    });
  }, [query, parameter]);

  const handleSliderChange = (newValues) => {
    const [newMin, newTarget, newMax] = newValues;

      setParameterValue({
        min: newMin,
        target: newTarget,
        max: newMax,
      });

      setParameters(prevParameters => ({
      ...prevParameters,
      [parameter]: {
        min: newMin,
        target: newTarget,
        max: newMax,
        label: query[parameter]['label']
      },

      }));

      onSetQueryParameter(query, parameter, newValues);
  };
  
  return (
    <Box 
      className={classes.sliderBox}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: (isSmScreen || isXsScreen) ? 'row' : 'column',
          justifyContent: (isSmScreen || isXsScreen) && 'space-between',
          alignItems: 'center',
          marginRight: !(isSmScreen || isXsScreen) && 2,
        }}
      >
        <FormControlLabel 
          control={
            <>
              <Typography>
                On
              </Typography>
              <Switch 
                onChange={handleContainerClick} 
                checked={itemSelected}
                sx={{
                  '& .MuiSwitch-switchBase': {
                    color: '#28bfe2',
                    opacity: '0.7',
                  },
                  '& .MuiSwitch-switchBase + .MuiSwitch-track': {
                    background: 'linear-gradient(to right, #28bfe2, #2c8bd8, #d96cb1)',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: '#d96cb1',
                    opacity: '0.7',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    background: 'linear-gradient(to right, #28bfe2, #2c8bd8, #d96cb1)',
                  },
                }}
              />
              <Typography paddingLeft='10px'>
                Off
              </Typography>
            </>
          } 
          labelPlacement='start' 
          sx={{ 
            padding: '0 20px 0 0',
          }}
        />
        <Typography variant='subtitle2'>
          {toCapitalCase(query[parameter].label)}
        </Typography>
      </Box>
      <Slider
        disabled={!itemSelected}
        disableSwap
        // track={false}
        aria-labelledby="track-false-range-slider"
        onChange={(e, newValues) => handleSliderChange(newValues)}
        // getAriaValueText={valuetext}
        value={[parameterValue.min, parameterValue.max, parameterValue.target]}
        marks={marks}
        valueLabelDisplay="auto"
        valueLabelFormat={(value, index) => {
          if (index === 0) return `Min: ${value}`;
          if (index === 1) return `Target: ${value}`;
          if (index === 2) return `Max: ${value}`;
          return '';
        }}
        max={
          parameter === 'duration_ms'
          ? 3600000
          : parameter === 'tempo'
          ? 300
          : parameter === 'mode' || parameter === 'popularity'
          ? 100
          : parameter === 'time_signature' 
          ? 7
          : parameter === 'key'
          ? 11
          : parameter === 'loudness'
          ? 0
          : 1
        }
        min={
          parameter === 'duration_ms'
          ? 30000
          : parameter === 'time_signature'
          ? 3
          : parameter === 'loudness'
          ? -60
          : 0
        }
        step={
          parameter === 'duration_ms' 
          ? 10
          : parameter === 'mode' 
            || parameter === 'popularity' 
            || parameter === 'key'
            || parameter === 'time_signature'
            || parameter === 'tempo'
          ? 1
          :0.01
        }
        sx={ 
          isLgScreen || isXlScreen || isMdScreen ? 
          { 
            width: '70%',
            opacity: '0.7',
            color: '#d96cb1',
              '& .MuiSlider-track': {
                background: 'linear-gradient(to right, #28bfe2, #2c8bd8, #d96cb1)'
              },
              '& .MuiSlider-rail': {
                background: 'linear-gradient(to right, #28bfe2, #2c8bd8, #d96cb1)'
              },
              '& .MuiSlider-markLabel': {
                color: 'white',
              },
          } : {
            width: '90%',
            alignSelf: 'flex-end',
            opacity: '0.7',
            color: '#d96cb1', 
              '& .MuiSlider-track': {
                background: 'linear-gradient(to right, #28bfe2, #2c8bd8, #d96cb1)'
              },
              '& .MuiSlider-rail': {
                background: 'linear-gradient(to right, #28bfe2, #2c8bd8, #d96cb1)'
              },
              '& .MuiSlider-markLabel': {
                color: 'white',
              },
          }
        }
      />
    </Box>
  )
};