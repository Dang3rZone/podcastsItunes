import { useState, useEffect } from 'react';

export const usePodcastData = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const podcastListUrl =
    'https://itunes.apple.com/search?term=podcast&country=US&limit=100';

  useEffect(() => {
    const fetchPodcasts = async () => {
      const response = await fetch(
        `https://api.allorigins.win/get?url=${encodeURIComponent(
          `${podcastListUrl}`
        )}`
      );
      const data = await response.json();
      const prettyToJSON = JSON.parse(data.contents);
      await setPodcasts(prettyToJSON.results);
      setIsLoading(false);
    };
    fetchPodcasts();
  }, []);

  return {
    podcasts,
    isLoading,
  };
};
