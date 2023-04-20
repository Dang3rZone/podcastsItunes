import { useParams } from 'react-router-dom';
import { Spinner, Row, Col, Card, Container, Badge } from 'react-bootstrap';
import { usePodcastEpisodes } from '../hooks/usePodcastEpisodes.js';

const EpisodesList = () => {
  const { trackId } = useParams();
  const {
    podcast,
    episodes,
    loading,
    currentEpisode,
    isPlaying,
    setCurrentEpisode,
    setIsPlaying,
  } = usePodcastEpisodes(trackId);
  const episodesToShow = episodes.slice(0, 8);

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
              <h3 data-testid="episode-list">
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
