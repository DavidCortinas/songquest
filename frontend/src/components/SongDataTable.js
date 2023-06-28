import React from 'react';
import { connect } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MaterialReactTable from 'material-react-table';
import { Grid, IconButton, Tooltip, Typography } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import SongForm from './SongForm';

const isEmptyObject = (obj) => {
  return Object.keys(obj).length === 0;
};

const Table = ({ songData, query }) => {
  console.log('table: ', songData, query)
  const columns = React.useMemo(
    () => [
      {
        accessorKey: 'song',
        header: 'Song',
      },
      {
        accessorKey: 'performer',
        header: 'Performer',
      },
      {
        accessorKey: 'writers',
        header: 'Writers',
      },
      {
        accessorKey: 'publisher',
        header: 'Publisher',
      },
      {
        accessorKey: 'address',
        header: 'Publisher Address',
      },
      {
        accessorKey: 'phoneNumber',
        header: 'Publisher Phone Number',
      },
      {
        accessorKey: 'email',
        header: 'Publisher Email',
      },
      {
        accessorKey: 'copyrights',
        header: 'Copyrights',
      },
      {
        accessorKey: 'label',
        header: 'Label',
      },
      {
        accessorKey: 'source',
        header: 'Source',
      },
    ],
    []
  );

  const dataRows = React.useMemo(() => {
    if (!songData) {
      return [];
    }

    const ascapResults = songData.ascap_results || {};
    const bmiResults = songData.bmi_results || {};

    if (isEmptyObject(ascapResults) && isEmptyObject(bmiResults)) {
      return [];
    }

    const formatPublishingResults = (arr) => {
      const flattenedArray = arr.flat();
      const lastIndex = flattenedArray.length - 1;

      return flattenedArray.map((item, index) => (
        <div>
          {item}
          {index !== lastIndex && (
            <>
              ,<br />
            </>
          )}
        </div>
      ));
    };

    const ascapDataRows = !isEmptyObject(ascapResults)
      ? ascapResults.title?.map((title, index) => ({
          song: title,
          performer: formatPublishingResults(ascapResults.performers[index]),
          writers: formatPublishingResults(ascapResults.writers[index]),
          publisher: formatPublishingResults(ascapResults.publishers[index]),
          address: formatPublishingResults(
            ascapResults.publishers_address[index]
          ),
          phoneNumber: formatPublishingResults(
            ascapResults.publishers_phone_number[index]
          ),
          email: formatPublishingResults(ascapResults.publishers_email[index]),
          copyrights: ascapResults.copyrights && ascapResults.copyrights.flat(),
          label: ascapResults.label && ascapResults.label.flat(),
          source: 'ASCAP/Spotify',
        }))
      : [];

    const bmiDataRows = !isEmptyObject(bmiResults)
      ? bmiResults.title?.map((title, index) => ({
          song: title,
          performer: formatPublishingResults(bmiResults.performers[index]),
          writers: formatPublishingResults(bmiResults.writers[index]),
          publisher: formatPublishingResults(bmiResults.publishers[index]),
          address: formatPublishingResults(
            bmiResults.publishers_address[index]
          ),
          phoneNumber: formatPublishingResults(
            bmiResults.publishers_phone_number[index]
          ),
          email: formatPublishingResults(bmiResults.publishers_email[index]),
          copyrights: bmiResults.copyrights && bmiResults.copyrights.flat(),
          label: bmiResults.label && bmiResults.label.flat(),
          source: 'BMI/Spotify',
        }))
      : [];

    // const combinedDataRows = [...ascapDataRows, ...bmiDataRows];

    return [...ascapDataRows, ...bmiDataRows];
  }, [songData]);

  const renderTopToolbarCustomActions = () => (
    <>
      <Tooltip arrow title="Refresh Data">
        <IconButton onClick={() => {}}>
          <RefreshIcon />
        </IconButton>
      </Tooltip>
      <Typography variant="h6" style={{ flex: 1 }}>
        {`${Object.keys(songData).length} Results for "${query.song}" by ${query.performer}`.toUpperCase()}
      </Typography>
    </>
  );

  return (
    <Grid container style={{ overflowX: 'none', maxWidth: '100vw', outerHeight: '100vw' }}>
      <Grid item xs={12} style={{ padding: '2% 0% 2% 2%'}}>
        <MaterialReactTable
          columns={columns}
          data={dataRows}
          initialState={{ showColumnFilters: true }}
          manualFiltering
          manualPagination
          manualSorting
          renderTopToolbarCustomActions={renderTopToolbarCustomActions}
          muiTableBodyProps={{ sx: {maxWidth: '100%' } }}
        />
      </Grid>
    </Grid>
  );
};

const SongDataTable = ({ onSearchPressed, onDataLoaded, query, songData }) => {
  const queryClient = new QueryClient();
  const showTable = !isEmptyObject(songData);
  console.log(showTable)

  return (
    <QueryClientProvider client={queryClient}>
      {showTable ? (
        <Table songData={songData} query={query} />
      ) : (
        <SongForm
          onSearchPressed={onSearchPressed}
          onDataLoaded={onDataLoaded}
          query={query}
        />
      )}
    </QueryClientProvider>
  );
};

const mapStateToProps = (state) => {
  return {
    query: state.song.query || {},
    songData: state.song.songData || {},
    dataLoaded: state.song.dataLoaded || {},
  };
};

export default connect(mapStateToProps)(SongDataTable);
