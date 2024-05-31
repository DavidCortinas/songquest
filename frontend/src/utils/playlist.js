const getPlaylistItems = playlist => {
	return playlist.tracks?.map((track, index) => {
		const artistNames = Array.isArray(track.artists)
			? track.artists.map(artist => artist.name).join(', ')
			: 'No artists';
		return `${(index + 1).toString()}. ${track.name} - ${artistNames}`;
	});
};

export default getPlaylistItems;
