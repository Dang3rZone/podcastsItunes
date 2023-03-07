import React from 'react';
import { Card, Col } from 'react-bootstrap';
import { Routes, Route, Link } from 'react-router-dom';
import EpisodeList from './EpisodeList';

const PodcastList = ({ trackId, podcast }) => {
  return (
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
  );
};

export default PodcastList;
