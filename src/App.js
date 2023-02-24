import React, { useState } from 'react';
import { Navbar, Container } from 'react-bootstrap';
import { Routes, Route } from 'react-router-dom';
import PodcastList from './components/PodcastList';
import EpisodeList from './components/EpisodeList';

const App = () => {
  const [podcasts] = useState([]);
  const [searchTerm] = useState();

  const filteredPodcasts = podcasts.filter((podcast) =>
    podcast.title.label.includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="/">Top Podcasts</Navbar.Brand>
        </Container>
      </Navbar>

      <Container>
        <Routes>
          <Route
            path="*"
            element={<PodcastList podcasts={filteredPodcasts} />}
          />
          <Route path="podcast/:trackId" element={<EpisodeList />} />
        </Routes>
      </Container>
    </>
  );
};

export default App;
