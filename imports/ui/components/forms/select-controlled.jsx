import React, { Component, PropTypes } from 'react';
import Select from 'antd/lib/select'; // for js
import 'antd/lib/select/style/css'; // for css

const Option = Select.Option;

//------------------------------------------------------------------------------
// COMPONENT:
//------------------------------------------------------------------------------
// When an input element is "controlled" by a model, the cursor will jump to the
// end of the line on every change. This makes it impossible to edit text that
// is not at the end of the input.
// SOURCE: see jimbola https://github.com/reactjs/react-redux/issues/525
class SelectControlled extends Component {
  // See ES6 Classes section at: https://facebook.github.io/react/docs/reusable-components.html
  constructor(props) {
    super(props);
    // this.state = { value: props.value || '' };
    this.handleChange = this.handleChange.bind(this);
  }

  /* componentWillReceiveProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      const value = nextProps.value;
      this.setState({ value });
    }
  } */

  handleChange(value) {
    // Get context
    const { id, onChange } = this.props;
    // Pass data up to parent component
    onChange({ fieldName: id, value });
  }

  render() {
    const { id, value, options, onChange, ...other } = this.props;

    const items = options && options.map((option) => (
      <Option key={option} value={option}>{option}</Option>
    ));

    return (
      <div id={id}>
        <Select
          value={value || undefined}
          showSearch
          onChange={this.handleChange}
          {...other}
        >
          {items}
        </Select>
      </div>
    );
  }
}

SelectControlled.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.any,
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default SelectControlled;
