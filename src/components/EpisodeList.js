import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  ListGroup,
  Spinner,
  Row,
  Col,
  Card,
  Table,
  Container,
} from 'react-bootstrap';
import xml2js from 'xml2js';

const EpisodesList = () => {
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { trackId } = useParams();

  useEffect(() => {
    const fetchEpisodes = async () => {
      setLoading(true);

      const response = await fetch(
        `https://api.allorigins.win/get?url=${encodeURIComponent(
          `https://itunes.apple.com/lookup?id=${trackId}`
        )}`
      );

      const data = await response.json();
      const prettyData = data.contents.replace(/\n/g, '');
      const prettyToJSON = JSON.parse(prettyData);
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
          //   console.log(x.contents);
          const json = xml2js.parseStringPromise(x.contents);

          console.log(json);
          return json;
        });

      console.log(responseXML.rss.channel);
      setEpisodes(responseXML.rss.channel);
      setLoading(false);
    };

    fetchEpisodes();
  }, [trackId]);

  return (
    <>
      {loading ? (
        <Spinner animation="border" />
      ) : (
        <div className="container">
          {episodes.map((episode) => (
            <Card key={episode.id} style={{ width: '18rem' }}>
              <Card.Img
                variant="top"
                src={episode.image[0].url}
                key={episode.id}
              />
              <Card.Body>
                <Card.Title>{episode.title}</Card.Title>
                <Card.Text>{episode.description}</Card.Text>
                <Card.Link href={episode.link}>Listen Now</Card.Link>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </>
  );
};
export default EpisodesList;
