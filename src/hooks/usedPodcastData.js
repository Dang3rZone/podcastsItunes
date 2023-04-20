import { useState, useEffect, useCallback } from 'react';

export const usePodcastData = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const iTunesPodcastSearchUrl =
    'https://itunes.apple.com/search?term=podcast&country=US&limit=100';

  const fetchPodcasts = useCallback(async () => {
    const response = await fetch(
      `https://api.allorigins.win/get?url=${encodeURIComponent(
        `${iTunesPodcastSearchUrl}`
      )}`
    );
    const data = await response.json();
    const prettyToJSON = JSON.parse(data.contents);
    await setPodcasts(prettyToJSON.results);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchPodcasts();
  }, [fetchPodcasts]);

  return {
    podcasts,
    isLoading,
  };
};
