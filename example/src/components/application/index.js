import React, { Component } from 'react';
import styled from 'styled-components';
import Grid from '../../../../lib';
import Actions from '../actions';
import findPath from '../../services/path-finder';
import config from '../../config';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

const Title = styled.h1`text-align: center;`;

class Application extends Component {
  constructor(props) {
    super(props);
    this.onSearch = this.onSearch.bind(this);
    this.onGridUpdate = this.onGridUpdate.bind(this);
    this.toggleClearance = this.toggleClearance.bind(this);

    const width = 40;
    const height = 30;
    this.state = {
      path : [],
      obstacles : [],
      clearance : new Array(30).fill(new Array(40)),
      start : {
        x : Math.round(config.MOBILE_SIZE / 2) + 1,
        y : Math.round(height / 2),
      },
      end : {
        x : width - 2 - Math.round(config.MOBILE_SIZE / 2),
        y : Math.round(height / 2),
      },
      width,
      height,
      withClearance : false,
    };
  }
  onGridUpdate({ obstacles, start, end }) {
    this.setState({ obstacles, start, end });
  }
  onSearch() {
    const { path, clearance } = findPath({
      grid : {
        width : this.state.width,
        height : this.state.height,
      },
      start : this.state.start,
      end : this.state.end,
      obstacles : this.state.obstacles,
      timeStep : this.state.timeStep,
      maxTime : this.state.maxTime,
    });
    this.setState({
      path,
      clearance,
    });
  }
  toggleClearance() {
    this.setState({ withClearance : !this.state.withClearance });
  }
  render() {
    return (
      <Container>
        <Title>React Grid Path</Title>
        <Actions
          onSearch={this.onSearch}
          toggleClearance={this.toggleClearance}
          withClearance={this.state.withClearance}
        />
        {/* react-grid-path Grid */}
        <Grid
          obstacles={this.state.obstacles}
          start={this.state.start}
          end={this.state.end}
          width={this.state.width}
          height={this.state.height}
          path={this.state.path}
          clearance={this.state.withClearance ? this.state.clearance : undefined}
          onGridUpdate={this.onGridUpdate}
          mobileSize={config.MOBILE_SIZE}
        />
      </Container>
    );
  }
}

export default Application;
