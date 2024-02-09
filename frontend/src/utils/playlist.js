const getPlaylistItems = (playlist) => {
  return playlist.songs?.map((track, index) => (
    `${(index + 1).toString()}. ${track.name} - ${track.artists}`
  ));
};

export default getPlaylistItems;