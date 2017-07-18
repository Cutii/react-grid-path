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
      mobile : createMobile(props.mobileSize, props.start),
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
  componentWillReceiveProps(nextProps) {
    if (nextProps.mobileSize !== this.props.mobileSize || nextProps.start !== this.props.start) {
      this.setState({ mobile : createMobile(nextProps.mobileSize, nextProps.start) });
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
      end,
      obstacles,
      cellSize = 25,
      disabled,
      clearance,
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
              if (this.state.mobile.includes(`${coords.x}/${coordsY}`)) {
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
                    clearance={clearance === undefined ? undefined : clearance[coordsY][coords.x]}
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
                    clearance={clearance === undefined ? undefined : clearance[coordsY][coords.x]}
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
                    clearance={clearance === undefined ? undefined : clearance[coordsY][coords.x]}
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
                  clearance={clearance === undefined ? undefined : clearance[coordsY][coords.x]}
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
  clearance : PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
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

function createMobile(mobileSize, start) {
  const odd = mobileSize % 2;
  const offset = odd ? (mobileSize - 1) / 2 : mobileSize / 2;
  const minX = start.x - offset;
  const maxX = odd ? start.x + offset : start.x;
  const minY = start.y - offset;
  const maxY = odd ? start.y + offset : start.y;
  const mobile = [];
  for (let x = minX; x <= maxX; x++) {
    for (let y = minY; y <= maxY; y++) {
      mobile.push(`${x}/${y}`);
    }
  }
  return mobile;
}
