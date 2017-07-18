import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 20px;
  right: 20px;
`;

const Button = styled.button`font-size: 1em;`;

const InputContainer = styled.div``;

const Label = styled.label``;

const Input = styled.input``;

const Actions = ({ onSearch, toggleClearance, withClearance, unitSize, onUnitSizeChange }) =>
  <Container>
    <Button onClick={onSearch}>Find</Button>
    {unitSize > 1
      ? <InputContainer>
        <Label>Toggle clearance</Label>
        <Input
          name="clearance"
          type="checkbox"
          checked={withClearance}
          onChange={toggleClearance}
        />
      </InputContainer>
      : null}
    <InputContainer>
      <Label>Unit size</Label>
      <Input name="unitSize" type="number" value={unitSize} onChange={onUnitSizeChange} />
    </InputContainer>
  </Container>;

Actions.propTypes = {
  onSearch : PropTypes.func.isRequired,
  toggleClearance : PropTypes.func.isRequired,
  withClearance : PropTypes.bool,
  onUnitSizeChange : PropTypes.func.isRequired,
  unitSize : PropTypes.number.isRequired,
};

export default Actions;
