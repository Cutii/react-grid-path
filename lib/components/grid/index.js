import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { PathLine } from 'react-svg-pathline';
import Cell from '../cell';
import { init } from '../../state';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  position: relative;
`;

const Path = styled.svg`
  position: absolute;
  width: ${props => props.computedWidth}px;
  height: ${props => props.computedHeight}px;
`;

class Grid extends Component {
  constructor(props) {
    super(props);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.state = {
      dragType : '',
    };
    if (!props.disabled) {
      init({
        start : this.props.start,
        end : this.props.end,
        obstacles : this.props.obstacles,
        onGridUpdate : this.props.onGridUpdate,
      });
    }
  }
  onMouseDown(type) {
    if (this.props.disabled) {
      return;
    }
    this.setState({
      dragType : type,
    });
  }
  onMouseUp() {
    if (this.props.disabled) {
      return;
    }
    this.setState({
      dragType : '',
    });
  }
  render() {
    const {
      height,
      width,
      path : waypoints,
      start,
      end,
      obstacles,
      cellSize = 25,
      disabled,
      mobileSize,
    } = this.props;
    const rows = [];
    for (let i = 0; i < height; i++) {
      const row = [];
      for (let j = 0; j < width; j++) {
        row.push({
          x : j,
          y : i,
        });
      }
      rows.push(row);
    }
    const pathGrid = getPathGrid({ waypoints, width, height });
    const path = waypoints.map(([x, y]) => ({
      x : x * cellSize + cellSize / 2,
      y : (height - y - 1) * cellSize + cellSize / 2,
    }));
    return (
      <Container>
        {waypoints.length
          ? <Path computedWidth={width * cellSize} computedHeight={height * cellSize}>
            <PathLine
              points={path}
              stroke="rgb(253, 237, 53)"
              strokeWidth="3"
              fill="none"
              r={10}
            />
          </Path>
          : null}
        {rows.map((row, index) =>
          // eslint-disable-next-line react/no-array-index-key
          <Row key={index}>
            {row.map((coords, subIndex) => {
              const coordsY = height - coords.y - 1;
              if (isMobile(coords, start, mobileSize)) {
                return (
                  <Cell
                    key={`${coords.y}/${coords.x}`}
                    size={cellSize}
                    x={coords.x}
                    y={coordsY}
                    type="START"
                    dragType={this.state.dragType}
                    mouseDown={this.onMouseDown}
                    mouseUp={this.onMouseUp}
                    onPath={!!pathGrid[height - index - 1][subIndex]}
                    disabled={disabled}
                  />
                );
              }
              if (coords.x === end.x && coordsY === end.y) {
                return (
                  <Cell
                    key={`${coords.y}/${coords.x}`}
                    size={cellSize}
                    x={coords.x}
                    y={coordsY}
                    type="TARGET"
                    dragType={this.state.dragType}
                    mouseDown={this.onMouseDown}
                    mouseUp={this.onMouseUp}
                    onPath={!!pathGrid[height - index - 1][subIndex]}
                    disabled={disabled}
                  />
                );
              }
              if (obstacles.some(({ x, y }) => coords.x === x && coordsY === y)) {
                return (
                  <Cell
                    key={`${coords.y}/${coords.x}`}
                    size={cellSize}
                    x={coords.x}
                    y={coordsY}
                    type="OBSTACLE"
                    dragType={this.state.dragType}
                    mouseDown={this.onMouseDown}
                    mouseUp={this.onMouseUp}
                    onPath={!!pathGrid[height - index - 1][subIndex]}
                    disabled={disabled}
                  />
                );
              }
              return (
                <Cell
                  key={`${coords.y}/${coords.x}`}
                  size={cellSize}
                  x={coords.x}
                  y={coordsY}
                  dragType={this.state.dragType}
                  mouseDown={this.onMouseDown}
                  mouseUp={this.onMouseUp}
                  onPath={!!pathGrid[height - index - 1][subIndex]}
                  disabled={disabled}
                />
              );
            })}
          </Row>
        )}
      </Container>
    );
  }
}

Grid.defaultProps = {
  path : [],
  mobileSize : 1,
};

Grid.propTypes = {
  width : PropTypes.number.isRequired,
  height : PropTypes.number.isRequired,
  path : PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  start : PropTypes.shape({
    x : PropTypes.number.isRequired,
    y : PropTypes.number.isRequired,
  }).isRequired,
  end : PropTypes.shape({
    x : PropTypes.number.isRequired,
    y : PropTypes.number.isRequired,
  }).isRequired,
  mobileSize : PropTypes.number,
  obstacles : PropTypes.arrayOf(
    PropTypes.shape({
      x : PropTypes.number.isRequired,
      y : PropTypes.number.isRequired,
    })
  ).isRequired,
  cellSize : PropTypes.number,
  onGridUpdate : PropTypes.func,
  disabled : PropTypes.bool,
};

export default Grid;

function getPathGrid({ waypoints, height, width }) {
  const emptyGrid = new Array(height).fill().map(() => new Array(width).fill(0));
  return waypoints.reduce((grid, waypoint, index) => {
    const next = waypoints[index + 1];
    const xStart = waypoint[0];
    const yStart = waypoint[1];
    const xEnd = next ? next[0] : xStart;
    const yEnd = next ? next[1] : yStart;
    range(xStart, xEnd, x =>
      range(yStart, yEnd, y => {
        grid[y][x] = 1;
      })
    );
    return grid;
  }, emptyGrid);
}

function range(start, end, callback) {
  const iStart = end > start ? start : end;
  const iEnd = end > start ? end : start;
  for (let i = iStart; i <= iEnd; i++) {
    callback(i);
  }
}

function isMobile(coords, start, mobileSize) {
  const minX = Math.round(start.x - mobileSize / 2);
  const maxX = Math.floor(start.x + mobileSize / 2);
  const minY = Math.round(start.y - mobileSize / 2);
  const maxY = Math.floor(start.y + mobileSize / 2);
  if (coords.x >= minX && coords.x <= maxX && coords.y >= minY && coords.y <= maxY) {
    return true;
  }
  return false;
}
