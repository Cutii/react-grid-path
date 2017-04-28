import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Container = styled.div`
  display          : flex;
  flex-direction   : row;
  justify-content  : center;
  align-items      : center;
  position         : fixed;
  top              : 20px;
  right            : 20px;
`;

const Button = styled.button`
  font-size: 1em;
`;

const Actions = ({ onSearch }) =>
  <Container onClick={onSearch} >
    <Button>Find</Button>
  </Container>;

Actions.propTypes = {
  onSearch : PropTypes.func.isRequired,
};

export default Actions;
