// Based on example provided by https://stackblitz.com/edit/d3-react-line-chart

import React, { Component } from "react";
import { select, selectAll } from "d3-selection";
import { axisBottom, axisLeft } from "d3-axis";
import { transition } from 'd3-transition';
import { scaleLinear, scaleBand } from 'd3-scale';
import { line, curveMonotoneX } from 'd3-shape';
import {extent, max} from 'd3-array';

class Axis extends React.Component {
  constructor() {
    super();
    this.ref = React.createRef();
  }
  componentDidMount() {
    this.renderAxis();
  }
  componentDidUpdate() {
    this.updateAxis();
  }
  renderAxis() {
    const { scale, orient, ticks } = this.props;
    const node = this.ref.current;
    let axis;

    if (orient === "bottom") {
      axis = axisBottom(scale);
    }
    if (orient === "left") {
      axis = axisLeft(scale)
        .ticks(ticks);
    }
    select(node).call(axis);
  }
  updateAxis() {
    const { scale, orient, ticks } = this.props;
    const t = transition().duration(1000)

    if (orient === "left") {
      const axis = axisLeft(scale).ticks(ticks);
      selectAll(`.${orient}`).transition(t).call(axis)
    }
  }
  render() {
    const { orient, transform } = this.props;
    return (
      <g
        ref={this.ref}
        transform={transform}
        className={`${orient} axis`}
      />
    );
  }
}

const XYAxis = ({ xScale, yScale, height }) => {
  const xSettings = {
    scale: xScale,
    orient: 'bottom',
    transform: `translate(0, ${height})`,
  };
  const ySettings = {
    scale: yScale,
    orient: 'left',
    transform: 'translate(0, 0)',
    ticks: 6,
  };
  return (
    <g className="axis-group">
      <Axis {...xSettings} />
      <Axis {...ySettings} />
    </g>
  );
};

class Line extends React.Component {
  constructor() {
    super();
    this.ref = React.createRef();
  }
  componentDidMount() {
    const node = this.ref.current;
    const { xScale, yScale, data, lineGenerator } = this.props;

    const initialData = data.map(d => ({
      name: d.name,
      value: 0
    }));

    /*

                                '#0C7300',
                                '#F8CD46',
                                '#DC7500',
                                '#E40004',
                                '#8200C5',
                                '#8B0D38'

     */
// set the dimensions and margins of the graph
    const margin = {top: 10, right: 30, bottom: 30, left: 60},
      //width = 460 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom
    // Add Y axis
    const y = scaleLinear()
      .domain([0, max])
      .range([ height, 0 ]);
    select(node).append("g")
      .call(axisLeft(y));

    select(node)
      .append("linearGradient")
      .attr("id", "line-gradient")
      .attr("gradientUnits", "userSpaceOnUse")
      .selectAll("stop")
      .data([
        {offset: "0%", color: "#0C7300"},
        {offset: "18%", color: "#F8CD46"},
        {offset: "36%", color: "#DC7500"},
        {offset: "54%", color: "#E40004"},
        {offset: "70%", color: "#8200C5"},
        {offset: "100%", color: "#8B0D38"}
      ])
      .enter().append("stop")
      .attr("offset", (d) => d.offset)
      .attr("stop-color", (d) => d.color);

    select(node)
      .append('path')
      .datum(initialData)
      .attr('id', 'line')
      .attr('stroke', 'url(#line-gradient)')
      .attr('stroke-width', 2)
      .attr('fill', 'none')
      .attr("d", lineGenerator)

    select(node)
      .selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'circle')
      .attr('stroke', '#ECC417')
      .attr('stroke-width', '2')
      .attr('fill', '#333')
      .attr('r', 3)
      .attr('cx', (d, key) => xScale(key))
      .attr('cy', d => yScale(d.count));

    this.updateChart();
  }
  componentDidUpdate() {
    this.updateChart();
  }
  updateChart() {
    const {
      lineGenerator, xScale, yScale, data,
    } = this.props;

    const t = transition().duration(1000);

    const line = select('#line');
    const dot = selectAll('.circle');

    line
      .datum(data)
      .transition(t)
      .attr('d', lineGenerator);

    dot
      .data(data)
      .transition(t)
      .attr('cx', (d, key) => xScale(key))
      .attr('cy', d => yScale(d.count));
  }
  render() {
    return <g className="line-group" ref={this.ref} />;
  }
}

class LineChart extends Component {
  constructor() {
    super();
    this.state = {
      data: [
        {name: 'Jan', value: 30},
        {name: 'Feb', value: 10},
        {name: 'Mar', value: 50},
        {name: 'Apr', value: 20},
        {name: 'May', value: 80},
        {name: 'Jun', value: 30},
        {name: 'July', value: 0},
        {name: 'Aug', value: 20},
        {name: 'Sep', value: 100},
        {name: 'Oct', value: 55},
        {name: 'Nov', value: 60},
        {name: 'Dec', value: 80},
      ],
    }
  }

  randomData = (e) => {
    e.preventDefault();
    this.setState((prevState) => {
      const data = prevState.data.map(d => ({
        name: d.name,
        value: Math.floor((Math.random() * 300) + 1)
      }))
      return {
        data
      }
    })
  }

  render() {
    const {data} = this.state;
    const parentWidth = 500;

    const margins = {
      top: 20,
      right: 20,
      bottom: 20,
      left: 20,
    };

    const width = parentWidth - margins.left - margins.right;
    const height = 200 - margins.top - margins.bottom;

    const ticks = 5;
    const t = transition().duration(1000);

    const xScale = scaleBand()
      .domain(data.map(d => d.name))
      .rangeRound([0, width]).padding(0.1);

    const yScale = scaleLinear()
      .domain(extent(data, d => d.value))
      .range([height, 0])
      .nice();

    const lineGenerator = line()
      .x(d => xScale(d.name))
      .y(d => yScale(d.value))
      .curve(curveMonotoneX);

    return (
      <div>
        <div>
          <button onClick={this.randomData}>Randomize data</button>
        </div>
        <svg
          className="lineChartSvg"
          width={width + margins.left + margins.right}
          height={height + margins.top + margins.bottom}
          style={{ margin: '1rem' }}
        >
          <g transform={`translate(${margins.left}, ${margins.top})`}>
            <XYAxis {...{xScale, yScale, height, ticks, t}} />
            <Line data={data} xScale={xScale} yScale={yScale} lineGenerator={lineGenerator} width={width}
                  height={height}/>
          </g>
        </svg>
      </div>
    );
  }
}

export { LineChart };



