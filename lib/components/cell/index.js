import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { update } from '../../state';

const colorMap = {
  START : 'rgb(78, 172, 72)',
  TARGET : 'rgb(226, 50, 45)',
  OBSTACLE : 'rgb(89, 118, 131)',
  EMPTY : 'transparent',
};

const Container = styled.div`
  width: ${props => props.size - 2}px;
  height: ${props => props.size - 2}px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  background-color: ${props => colorMap[props.type]};
  user-select: none;
  text-align: center;
  vertical-align: middle;
  cursor: ${props => (props.type === 'START' || props.type === 'TARGET' ? 'grab' : 'default')};
`;

class Cell extends Component {
  constructor(props) {
    super(props);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.toggle = this.toggle.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.updateState = this.updateState.bind(this);
    this.state = {
      type : props.type,
    };
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.type !== nextProps.type) {
      this.setState({ type : nextProps.type });
    }
  }
  onMouseDown() {
    this.props.mouseDown(this.state.type);
    this.toggle();
  }
  onMouseUp() {
    this.props.mouseUp();
  }
  onMouseEnter() {
    if (this.props.dragType === 'EMPTY' || this.props.dragType === 'OBSTACLE') {
      return this.toggle();
    }
    if (this.props.dragType === 'START') {
      return this.updateState({
        type : 'START',
      });
    }
    if (this.props.dragType === 'TARGET') {
      return this.updateState({
        type : 'TARGET',
      });
    }
  }
  onMouseLeave() {
    if (this.props.dragType === 'START' || this.props.dragType === 'TARGET') {
      return this.updateState({
        type : 'EMPTY',
      });
    }
  }
  toggle() {
    if (this.state.type === 'EMPTY') {
      return this.updateState({
        type : 'OBSTACLE',
      });
    }
    if (this.state.type === 'OBSTACLE') {
      return this.updateState({
        type : 'EMPTY',
      });
    }
  }
  updateState(state) {
    if (this.props.disabled) {
      return;
    }
    if (state.type !== this.state.type) {
      update({
        x : this.props.x,
        y : this.props.y,
        type : state.type,
        previousType : this.state.type,
      });
      this.setState(state);
    }
  }
  render() {
    return (
      <Container
        size={this.props.size}
        type={this.state.type}
        onMouseDown={this.onMouseDown}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onMouseUp={this.onMouseUp}
        onPath={this.props.onPath && this.state.type !== 'START' && this.state.type !== 'TARGET'}
      >
        {this.props.clearance === undefined ? '' : this.props.clearance}
      </Container>
    );
  }
}

Cell.defaultProps = {
  type : 'EMPTY',
};

Cell.propTypes = {
  type : PropTypes.oneOf(Object.keys(colorMap)),
  dragType : PropTypes.string,
  mouseUp : PropTypes.func.isRequired,
  mouseDown : PropTypes.func.isRequired,
  onPath : PropTypes.bool,
  x : PropTypes.number.isRequired,
  y : PropTypes.number.isRequired,
  size : PropTypes.number,
  disabled : PropTypes.bool,
  clearance : PropTypes.number,
};

export default Cell;
