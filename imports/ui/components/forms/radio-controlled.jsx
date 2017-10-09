import React, { Component, PropTypes } from 'react';
import Radio from 'antd/lib/radio'; // for js
import 'antd/lib/radio/style/css'; // for css

const RadioGroup = Radio.Group;

//------------------------------------------------------------------------------
// COMPONENT:
//------------------------------------------------------------------------------
// When an input element is "controlled" by a model, the cursor will jump to the
// end of the line on every change. This makes it impossible to edit text that
// is not at the end of the input.
// SOURCE: see jimbola https://github.com/reactjs/react-redux/issues/525
class RadioControlled extends Component {
  // See ES6 Classes section at: https://facebook.github.io/react/docs/reusable-components.html
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(evt) {
    // Get context
    const { id, onChange } = this.props;
    // Pass data up to parent component
    onChange({ fieldName: id, value: evt.target.value });
  }

  render() {
    const { id, value, options, onChange, ...other } = this.props;

    const items = options && options.map(({ value: val, label }) => (
      <Radio key={label} value={val}>{label}</Radio>
    ));

    return (
      <div id={id}>
        <RadioGroup
          value={value}
          onChange={this.handleChange}
          {...other}
        >
          {items}
        </RadioGroup>
      </div>
    );
  }
}

RadioControlled.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.oneOf(
    PropTypes.string,
    PropTypes.number,
  ),
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.any.isRequired,
      label: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
  onChange: PropTypes.func.isRequired,
};

RadioControlled.defaultProps = {
  value: undefined,
};

export default RadioControlled;
