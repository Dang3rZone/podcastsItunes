import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Spinner, Row, Col, Card, Container, Badge } from 'react-bootstrap';
import xml2js from 'xml2js';

const ONE_DAY = 24 * 60 * 60 * 1000; // milliseconds in one day

const EpisodesList = () => {
  const [podcast, setPodcast] = useState({});
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { trackId } = useParams();
  const episodesToShow = episodes.slice(0, 8);

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

  return (
    <div
      className="d-flex justify-content-center align-items-center mt-5"
      style={{ minHeight: '100vh' }}
    >
      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Fetching episodes...</span>
        </Spinner>
      ) : (
        <Container>
          <Row>
            <Col md={4}>
              <Card style={{ width: '100%' }}>
                <Card.Img variant="top" src={podcast.artworkUrl600} />
                <Card.Body>
                  <Card.Title>{podcast.trackName}</Card.Title>
                  <Card.Text>{podcast.artistName}</Card.Text>
                  <Card.Text>{podcast.collectionName}</Card.Text>
                  <Card.Text>{podcast.primaryGenreName}</Card.Text>
                  <Card.Text>{podcast.releaseDate}</Card.Text>
                  <Card.Link href={podcast.collectionViewUrl}>
                    View on iTunes
                  </Card.Link>
                </Card.Body>
              </Card>
            </Col>
            <Col md={8}>
              <h3>
                Episodes <Badge bg="success">{episodes.length}</Badge>
              </h3>
              {episodesToShow.map((episode, index) => (
                <Card key={index}>
                  <Card.Body>
                    <Card.Title>{episode.title}</Card.Title>
                    <Card.Text>
                      {episode.description[0] &&
                      episode.description[0].replace(/(<([^>]+)>)/gi, '')
                        .length > 250
                        ? `${episode.description[0]
                            .replace(/(<([^>]+)>)/gi, '')
                            .slice(0, 250)}...`
                        : episode.description[0].replace(/(<([^>]+)>)/gi, '')}
                    </Card.Text>
                    <Card.Text>
                      Duration: {episode['itunes:duration']}
                    </Card.Text>
                    <Card.Text>
                      Published:{' '}
                      {new Date(episode.pubDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </Card.Text>
                    {currentEpisode && currentEpisode.guid === episode.guid ? (
                      <audio
                        controls
                        src={currentEpisode.enclosure[0].$.url}
                        onEnded={() => setCurrentEpisode(null)}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                      >
                        Your browser does not support the audio element.
                      </audio>
                    ) : (
                      <Card.Link
                        style={{ cursor: 'pointer' }}
                        onClick={() => setCurrentEpisode(episode)}
                      >
                        {isPlaying ? 'Playing...' : 'Listen Now'}
                      </Card.Link>
                    )}
                  </Card.Body>
                </Card>
              ))}
            </Col>
          </Row>
        </Container>
      )}
    </div>
  );
};

export default EpisodesList;
