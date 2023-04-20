import { usePodcastData } from './hooks/usedPodcastData';
import React, { useState } from 'react';
import { Container, Spinner, Row } from 'react-bootstrap';
import { Routes, Route, useParams } from 'react-router-dom';
import PodcastList from './components/PodcastList';
import EpisodeList from './components/EpisodeList';
import SearchBar from './components/SearchBar';

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { trackId } = useParams();
  const { podcasts, isLoading } = usePodcastData();

  // Handle Search and Filter
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
