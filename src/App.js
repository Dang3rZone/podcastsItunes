import React, { useState, useEffect } from 'react';
import { Container, Spinner, Row } from 'react-bootstrap';
import { Routes, Route, useParams } from 'react-router-dom';
import PodcastList from './components/PodcastList';
import EpisodeList from './components/EpisodeList';
import SearchBar from './components/SearchBar';

const App = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { trackId } = useParams();
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
      //       .then((response) => {
      //     if (response.ok) return response.json();
      //     throw new Error('Network response was not ok.');
      //   });

      const data = await response.json();
      //   const prettyData = response.contents.replace(/\n/g, '');
      const prettyToJSON = JSON.parse(data.contents);

      await setPodcasts(prettyToJSON.results);
      setIsLoading(false);
    };

    fetchPodcasts();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredPodcasts = podcasts.filter((podcast) => {
    return podcast.trackName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div
      className="d-flex justify-content-center align-items-center mt-5"
      style={{ minHeight: '100vh' }}
    >
      {isLoading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Fetching episodes...</span>
        </Spinner>
      ) : (
        <Container>
          <SearchBar handleSearch={handleSearch} searchTerm={searchTerm} />
          <Row>
            <Routes>
              <Route
                path="*"
                element={
                  <PodcastList podcasts={filteredPodcasts} trackId={trackId} />
                }
              />
              <Route path="podcast/:trackId" element={<EpisodeList />} />
            </Routes>
          </Row>
        </Container>
      )}
    </div>
  );
};

export default App;
