import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Spinner, Container } from 'react-bootstrap';
import { Link, Route, Routes, useParams } from 'react-router-dom';
import EpisodeList from './EpisodeList';

const PodcastList = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { trackId } = useParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPodcasts = async () => {
      const response = await fetch(
        `https://api.allorigins.win/get?url=${encodeURIComponent(
          'https://itunes.apple.com/search?term=podcast&country=US&limit=100'
        )}`
      );

      const data = await response.json();
      const prettyData = data.contents.replace(/\n/g, '');
      const prettyToJSON = JSON.parse(prettyData);

      setPodcasts(prettyToJSON.results);
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
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: '100vh' }}
    >
      {isLoading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Fetching episodes...</span>
        </Spinner>
      ) : (
        <Container>
          <Row className="mt-3 m-4 fixed-top">
            <Col>
              <div className="d-flex justify-content-end">
                <input
                  type="text"
                  placeholder="Search Podcasts..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
            </Col>
          </Row>
          <Row>
            {filteredPodcasts.map((podcast) => (
              <Col key={podcast.trackId} xs={12} sm={6} md={4} lg={3}>
                <Card className="mb-4">
                  <Card.Img variant="top" src={podcast.artworkUrl600} />
                  <Card.Body>
                    <Card.Title>{podcast.trackName}</Card.Title>
                    <Card.Text>{podcast.artistName}</Card.Text>
                    <Link to={`podcast/${podcast.trackId}`}>View Episodes</Link>
                    <Routes>
                      <Route
                        path={`podcast/${trackId}`}
                        element={<EpisodeList trackId={trackId} />}
                      ></Route>
                    </Routes>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      )}
    </div>
  );
};

export default PodcastList;
