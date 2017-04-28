import React, { Component } from 'react';
import styled from 'styled-components';
import Grid from '../../../../lib';
import Actions from '../actions';
import findPath from '../../services/path-finder';

const Container = styled.div`
  display        : flex;
  flex-direction : column;
  align-items    : stretch;
`;

const Title = styled.h1`
  text-align : center;
`;

class Application extends Component {
  constructor(props) {
    super(props);
    this.onSearch     = this.onSearch.bind(this);
    this.onGridUpdate = this.onGridUpdate.bind(this);

    const width  = 40;
    const height = 30;
    this.state   = {
      path      : [],
      obstacles : [],
      start     : {
        x : 0,
        y : Math.round(height / 2),
      },
      end            : {
        x : width - 1,
        y : Math.round(height / 2),
      },
      width,
      height,
    };
  }
  onGridUpdate({ obstacles, start, end }) {
    this.setState({ obstacles, start, end });
  }
  onSearch() {
    const path = findPath({
      grid : {
        width  : this.state.width,
        height : this.state.height,
      },
      start     : this.state.start,
      end       : this.state.end,
      obstacles : this.state.obstacles,
      timeStep  : this.state.timeStep,
      maxTime   : this.state.maxTime,
    });
    this.setState({
      path,
    });
  }
  render() {
    return (
      <Container>
        <Title>React Grid Path</Title>
        <Actions onSearch={this.onSearch} />
        {/* react-grid-path Grid */}
        <Grid
          obstacles={this.state.obstacles}
          start={this.state.start}
          end={this.state.end}
          width={this.state.width}
          height={this.state.height}
          path={this.state.path}
          onGridUpdate={this.onGridUpdate}
        />
      </Container>
    );
  }
}

export default Application;
