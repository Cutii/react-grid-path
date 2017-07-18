import React, { Component } from 'react';
import styled from 'styled-components';
import Grid from '../../../../lib';
import Actions from '../actions';
import findPath from '../../services/path-finder';

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
    this.onUnitSizeChange = this.onUnitSizeChange.bind(this);

    const width = 40;
    const height = 30;
    this.state = {
      path : [],
      obstacles : [],
      clearance : new Array(30).fill(new Array(40)),
      start : {
        x : 1,
        y : Math.round(height / 2),
      },
      end : {
        x : width - 2,
        y : Math.round(height / 2),
      },
      width,
      height,
      withClearance : false,
      unitSize : 1,
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
      unitSize : this.state.unitSize,
    });
    this.setState({
      path,
      clearance,
    });
  }
  onUnitSizeChange(event) {
    this.setState({
      unitSize : parseInt(event.target.value, 10),
      withClearance : event.target.value <= 1 ? false : this.state.withClearance,
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
          unitSize={this.state.unitSize}
          onUnitSizeChange={this.onUnitSizeChange}
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
          mobileSize={this.state.unitSize}
        />
      </Container>
    );
  }
}

export default Application;
