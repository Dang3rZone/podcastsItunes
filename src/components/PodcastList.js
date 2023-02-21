import React, { useState, useEffect } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { Link, useNavigate, Route, Routes, useParams } from 'react-router-dom';
import EpisodeList from './EpisodeList';

const PodcastList = () => {
  const history = useNavigate();
  const [podcasts, setPodcasts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { trackId } = useParams();
  //   const handleViewEpisodes = (trackId) => {
  //     history.push(`/episodes/${trackId}`);
  //   };

  useEffect(() => {
    const fetchPodcasts = async () => {
      const response = await fetch(
        'https://itunes.apple.com/search?term=podcast&country=US&limit=100'
      );
      const data = await response.json();
      setPodcasts(data.results);
      //   console.log(data);
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
    <>
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-end">
            <input
              type="text"
              placeholder="Search Podcasts"
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
    </>
  );
};

export default PodcastList;
