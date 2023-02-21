import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ handleSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate(`/podcasts?search=${searchTerm}`);
    handleSearch(searchTerm);
  };

  return (
    <Form onSubmit={handleSubmit} inline>
      <div className="input-group">
        <Form.Control
          type="text"
          placeholder="Search podcasts"
          className="mr-sm-2"
          value={searchTerm}
          onChange={handleInputChange}
        />
        <Button variant="outline-light" type="submit">
          Search
        </Button>
      </div>
    </Form>
  );
};

export default SearchBar;

// import { useState } from 'react';
// import { Form, Button } from 'react-bootstrap';

// const SearchBar = ({ onSearch }) => {
//   const [query, setQuery] = useState('');

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const corsProxy = 'https://cors-anywhere.herokuapp.com/';
//     const apiUrl = `${corsProxy}https://itunes.apple.com/search?term=${query}&media=podcast&entity=podcast&limit=10`;
//     onSearch(apiUrl);
//   };

//   return (
//     <Form onSubmit={handleSubmit} inline>
//       <Form.Control
//         type="text"
//         placeholder="Search podcasts..."
//         className="mr-sm-2"
//         value={query}
//         onChange={(e) => setQuery(e.target.value)}
//       />
//       <Button type="submit" variant="outline-primary">
//         Search
//       </Button>
//     </Form>
//   );
// };

// export default SearchBar;
