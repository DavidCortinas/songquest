import { Typography } from "@mui/material";
import { useEffect, useState } from "react";

export const toCapitalCase= (str) => {
    if (str) {
        return str
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
    } else {
      return str
    };
};

export const handleExploreMoreClick = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

export const TokenCounter = ({ tokens }) => {
  const [displayTokens, setDisplayTokens] = useState(tokens);
  const [addedTokens, setAddedTokens] = useState(0);

  useEffect(() => {
    const newTokensAdded = tokens - displayTokens;
    if (newTokensAdded > 0) {
      setAddedTokens(newTokensAdded);
      let currentDisplay = displayTokens;
      
      const intervalId = setInterval(() => {
        currentDisplay++;
        setDisplayTokens(currentDisplay);
        if (currentDisplay >= tokens) {
          clearInterval(intervalId);
        }
      }, 50);
    }
  }, [tokens]);

  return (
    <Typography
      color='white'
      paddingRight='1%'
      variant='h6'
    >
      {addedTokens > 0 && (
        <div className="added-tokens-animation">+{addedTokens}</div>
      )}
      {displayTokens}
    </Typography>
  );
};

export const XPCounter = ({ currentXp, maxXp }) => {
  const [displayXp, setDisplayXp] = useState(currentXp);
  const [addedXp, setAddedXp] = useState(0);

  useEffect(() => {
    if (displayXp === undefined) {
      setDisplayXp(currentXp);
      return;
    };

    const xpDifference = currentXp - displayXp;
    if (xpDifference > 0) {
      setAddedXp(xpDifference);
      let currentDisplay = displayXp;
      
      const intervalId = setInterval(() => {
        currentDisplay++;
        setDisplayXp(currentDisplay);
        if (currentDisplay >= currentXp) {
          clearInterval(intervalId);
          setTimeout(() => setAddedXp(0), 2000);
        }
      }, 50);
    }
  }, [currentXp, displayXp]);

  return (
    <Typography
      color='white'
      paddingRight='1%'
      letterSpacing='1px'
    >
      {addedXp > 0 && (
        <div className="added-xp-animation">+{addedXp}</div>
      )}
        {`${displayXp}/${maxXp}xp`}
    </Typography>
  );
};

export const transformResponseToQueryStructure = (responseData) => {
  const {
    name,
    limit,
    market,
    seed_artists,
    seed_genres,
    seed_tracks,
    min_acousticness,
    max_acousticness,
    target_acousticness,
    min_danceability,
    max_danceability,
    target_danceability,
    min_duration_ms,
    max_duration_ms,
    target_duration_ms,
    min_energy,
    max_energy,
    target_energy,
    min_instrumentalness,
    max_instrumentalness,
    target_instrumentalness,
    min_key,
    max_key,
    target_key,
    min_liveness,
    max_liveness,
    target_liveness,
    min_loudness,
    max_loudness,
    target_loudness,
    min_mode,
    max_mode,
    target_mode,
    min_popularity,
    max_popularity,
    target_popularity,
    min_speechiness,
    max_speechiness,
    target_speechiness,
    min_tempo,
    max_tempo,
    target_tempo,
    min_time_signature,
    max_time_signature,
    target_time_signature,
    min_valence,
    max_valence,
    target_valence,
  } = responseData;

  const transformedQuery = {
    name,
    query: {
      limit,
      songs: JSON.parse(seed_tracks || '[]'),
      performers: JSON.parse(seed_artists || '[]'),
      genres: JSON.parse(seed_genres || '[]'),
      market,
      acousticness: {
        min: min_acousticness,
        target: target_acousticness,
        max: max_acousticness,
        label: 'acousticness',
      },
      danceability: {
        min: min_danceability,
        target: target_danceability,
        max: max_danceability,
        label: 'danceability',
      },
      duration_ms: {
        min: min_duration_ms,
        target: target_duration_ms,
        max: max_duration_ms,
        label: 'duration_ms',
      },
      energy: {
        min: min_energy,
        target: target_energy,
        max: max_energy,
        label: 'energy',
      },
      instrumentalness: {
        min: min_instrumentalness,
        target: target_instrumentalness,
        max: max_instrumentalness,
        label: 'instrumentalness',
      },
      key: {
        min: min_key,
        target: target_key,
        max: max_key,
        label: 'key',
      },
      liveness: {
        min: min_liveness,
        target: target_liveness,
        max: max_liveness,
        label: 'liveness',
      },
      loudness: {
        min: min_loudness,
        target: target_loudness,
        max: max_loudness,
        label: 'loudness',
      },
      mode: {
        min: min_mode,
        target: target_mode,
        max: max_mode,
        label: 'mode',
      },
      popularity: {
        min: min_popularity,
        target: target_popularity,
        max: max_popularity,
        label: 'popularity',
      },
      speechiness: {
        min: min_speechiness,
        target: target_speechiness,
        max: max_speechiness,
        label: 'speechiness',
      },
      tempo: {
        min: min_tempo,
        target: target_tempo,
        max: max_tempo,
        label: 'tempo',
      },
      time_signature: {
        min: min_time_signature,
        target: target_time_signature,
        max: max_time_signature,
        label: 'time_signature',
      },
      valence: {
        min: min_valence,
        target: target_valence,
        max: max_valence,
        label: 'valence',
      },
    },
  };

  return transformedQuery;
};

export const toCamelCase = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(v => toCamelCase(v));
  } else if (obj !== null && obj?.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      const camelCaseKey = key.replace(/([-_][a-z])/ig, ($1) => $1.toUpperCase().replace('-', '').replace('_', ''));
      result[camelCaseKey] = toCamelCase(obj[key]);
      return result;
    }, {});
  }
  return obj;
};

export const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

