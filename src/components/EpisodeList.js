import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ListGroup, Spinner, Row, Col, Card } from 'react-bootstrap';
import { xml2json } from 'xml-js';

let response2;
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

      fetch(
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
          const json = xml2json(x.contents);
          //   response2 = structuredClone(json);
          return json;
          //   console.log(json);
        });
    };

    const test = fetchEpisodes().then((response) => {
      console.log(response);
    });
    Promise.allSettled(test).then((response) => {
      console.log(response);
    });
    console.log(test);
    setEpisodes(response2);
    setLoading(false);
  }, [trackId]);

  return (
    <>
      {/* {loading ? (
        <Spinner animation="border" />
      ) : (
        // <ListGroup>
        //   {episodes.map((episode) => (
        //     <ListGroup.Item key={episode.id.attributes['im:id']}>
        //       {episode.title.label}
        //     </ListGroup.Item>
        //   ))}
        // </ListGroup>
        <Row xs={1} md={2} lg={3} className="g-4">
          {episodes.map((episode) => (
            <Col key={episode.trackId}>
              <Card>
                <Card.Body>
                  <Card.Title>{episode.collectionName}</Card.Title>
                  <Card.Text>{episode.artistName}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )} */}
    </>
  );
};

export default EpisodesList;

// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';

// const EpisodesList = () => {
//   const { podcastId } = useParams();
//   const [episodes, setEpisodes] = useState([]);

//   useEffect(() => {
//     const fetchEpisodes = async () => {
//       const response = await fetch(
//         `https://itunes.apple.com/lookup?id=${podcastId}`
//       );
//       const data = await response.json();

//       setEpisodes(data.results.feedUrl);
//     };

//     fetchEpisodes();
//   }, [podcastId]);

//   return (
//     <div>
//       {episodes.map((episode) => (
//         <div key={episode.guid}>
//           <h3>{episode.title}</h3>
//           <p>{episode.description}</p>
//           <audio controls>
//             <source
//               src={episode.enclosures[0].url}
//               type={episode.enclosures[0].type}
//             />
//             Your browser does not support the audio element.
//           </audio>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default EpisodesList;

// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { Card } from 'react-bootstrap';

// function EpisodeList() {
//   const { podcastId } = useParams();
//   const [episodes, setEpisodes] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       const url = `https://itunes.apple.com/lookup?id=${podcastId}`;
//       const response = await fetch(url);
//       const data = await response.json();
//       setEpisodes(data.results.feed.entry);
//     };
//     fetchData();
//   }, [podcastId]);

//   return (
//     <div>
//       <h2>Episodes</h2>
//       {episodes.map((episode) => (
//         <Card key={episode.id.attributes['im:id']}>
//           <Card.Body>
//             <Card.Title>{episode.title.label}</Card.Title>
//             <Card.Text>{episode.summary.label}</Card.Text>
//           </Card.Body>
//         </Card>
//       ))}
//     </div>
//   );
// }

// export default EpisodeList;

// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { Container, Row, Col, Card } from 'react-bootstrap';

// const EpisodeList = () => {
//   const [episodes, setEpisodes] = useState([]);
//   const { podcastId } = useParams();

//   useEffect(() => {
//     fetch(`https://itunes.apple.com/lookup?id=${podcastId}`)
//       .then((response) => response.json())
//       .then((data) => {
//         const episodes = data.results;
//         setEpisodes(episodes);
//       });
//   }, [podcastId]);

//   return (
//     <Container>
//       <h2 className="text-center mb-3">Episodes</h2>
//       <Row xs={1} md={2} lg={3} className="g-4">
//         {episodes.map((episode) => (
//           <Col key={episode.trackId}>
//             <Card>
//               <Card.Body>
//                 <Card.Title>{episode.trackName}</Card.Title>
//                 <Card.Text>{episode.artistName}</Card.Text>
//               </Card.Body>
//             </Card>
//           </Col>
//         ))}
//       </Row>
//     </Container>
//   );
// };

// export default EpisodeList;
