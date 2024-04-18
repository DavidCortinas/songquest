import { useState, useEffect } from 'react';

export const useSelectedPlaylist = (playlists, initialSelectedPlaylist) => {
	const [selectedPlaylist, setSelectedPlaylist] = useState(initialSelectedPlaylist);

	useEffect(() => {
		const existsInPlaylists = playlists.some(p => p.id === selectedPlaylist?.id);
		if (!existsInPlaylists) {
			setSelectedPlaylist(null);
		}
	}, [playlists, selectedPlaylist]);

	return [selectedPlaylist, setSelectedPlaylist];
};