import { useState, useEffect } from 'react';
import xml2js from 'xml2js';

const ONE_DAY = 24 * 60 * 60 * 1000; // milliseconds in one day

export function usePodcastEpisodes(trackId) {
  const [podcast, setPodcast] = useState({});
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        setLoading(true);

        const cachedPodcast = sessionStorage.getItem(`podcast-${trackId}`);
        const cachedEpisodes = sessionStorage.getItem(`episodes-${trackId}`);
        if (cachedPodcast && cachedEpisodes) {
          const parsedPodcast = JSON.parse(cachedPodcast);
          const parsedEpisodes = JSON.parse(cachedEpisodes);
          const ageInMs = Date.now() - parsedPodcast.timestamp;
          if (ageInMs < ONE_DAY) {
            setPodcast(parsedPodcast.data);
            setEpisodes(parsedEpisodes.data);
            setLoading(false);
            return;
          }
        }

        const response = await fetch(
          `https://api.allorigins.win/get?url=${encodeURIComponent(
            `https://itunes.apple.com/lookup?id=${trackId}`
          )}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch episodes');
        }

        const data = await response.json();
        const prettyData = data.contents.replace(/\n/g, '');
        const prettyToJSON = JSON.parse(prettyData);
        const podcastData = prettyToJSON.results;

        setPodcast(podcastData[0]);

        const finalData = prettyToJSON.results[0].feedUrl;

        const responseXML = await fetch(
          `https://api.allorigins.win/get?url=${encodeURIComponent(
            `${finalData}`
          )}`
        )
          .then((response) => {
            if (response.ok) {
              return response.json();
            }
            throw new Error('Network response was not ok.');
          })
          .then((x) => {
            if (x && x.contents) {
              const json = xml2js.parseStringPromise(x.contents);

              return json;
            } else {
              throw new Error('XML response was invalid.');
            }
          });

        sessionStorage.setItem(
          `episodes-${trackId}`,
          JSON.stringify({
            timestamp: Date.now(),
            data: responseXML.rss.channel[0].item.slice(0, 20),
          })
        );

        setEpisodes(responseXML.rss.channel[0].item);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchEpisodes();
    window.scrollTo(0, 0);
  }, [trackId]);

  return {
    podcast,
    episodes,
    loading,
    currentEpisode,
    isPlaying,
    setCurrentEpisode,
    setIsPlaying,
  };
}
