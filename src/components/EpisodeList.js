import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Spinner, Row, Col, Card, Container } from 'react-bootstrap';
import xml2js from 'xml2js';

const ONE_DAY = 24 * 60 * 60 * 1000; // milliseconds in one day

const EpisodesList = () => {
  const [podcast, setPodcast] = useState({});
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { trackId } = useParams();
  const episodesToShow = episodes.slice(0, 8);

  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        setLoading(true);

        const cachedPodcast = localStorage.getItem(`podcast-${trackId}`);
        const cachedEpisodes = localStorage.getItem(`episodes-${trackId}`);
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
        console.log('podcast', podcastData);
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
              // check if x exists and has a contents property
              const json = xml2js.parseStringPromise(x.contents);

              return json;
            } else {
              throw new Error('XML response was invalid.');
            }
          });

        console.log('episodes', responseXML.rss.channel[0].item);

        // localStorage.setItem(
        //   `episodes-${trackId}`,
        //   JSON.stringify({
        //     timestamp: Date.now(),
        //     data: responseXML.rss.channel[0].item,
        //   })
        // );

        setEpisodes(responseXML.rss.channel[0].item);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchEpisodes();
  }, [trackId]);

  return (
    <>
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
                    <Card.Link href={episode.link}>Listen Now</Card.Link>
                  </Card.Body>
                </Card>
              ))}
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
};

export default EpisodesList;
