import { Row, Col } from 'react-bootstrap';

const SearchBar = ({ handleSearch, searchTerm }) => {
  return (
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
  );
};

export default SearchBar;
