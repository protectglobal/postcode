import React, { Component, PropTypes } from 'react';
import Switch from 'antd/lib/switch'; // for js
import 'antd/lib/switch/style/css'; // for css

const RadioGroup = Radio.Group;

//------------------------------------------------------------------------------
// COMPONENT:
//------------------------------------------------------------------------------
// When an input element is "controlled" by a model, the cursor will jump to the
// end of the line on every change. This makes it impossible to edit text that
// is not at the end of the input.
// SOURCE: see jimbola https://github.com/reactjs/react-redux/issues/525
class SwitchControlled extends Component {
  // See ES6 Classes section at: https://facebook.github.io/react/docs/reusable-components.html
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(evt) {
    console.log('evt', evt);
    // Get context
    const { id, onChange } = this.props;
    // Pass data up to parent component
    onChange({ fieldName: id, value: evt.target.value });
  }

  render() {
    const { id, checked, onChange, ...other } = this.props;

    return (
      <div id={id}>
        <Switch
          checked={checked}
          onChange={this.handleChange}
          {...other}
        />
      </div>
    );
  }
}

SwitchControlled.propTypes = {
  id: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
};

SwitchControlled.defaultProps = {
  checked: false,
};

export default SwitchControlled;
