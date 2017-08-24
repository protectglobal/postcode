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
class TagsSelectControlled extends Component {
  // See ES6 Classes section at: https://facebook.github.io/react/docs/reusable-components.html
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  handleChange(value) {
    // Get context
    const { id, onChange } = this.props;
    // Pass data up to parent component
    onChange({ fieldName: id, value });
  }

  handleSearch(value) {
    // Get context
    const { id, onSearch } = this.props;
    // Pass data up to parent component
    onSearch({ fieldName: id, value });
  }

  render() {
    const { id, options, onChange, onSearch, ...other } = this.props;

    const items = options && options.map(option => (
      <Option key={option} value={option}>{option}</Option>
    ));

    return (
      <div id={id}>
        <Select
          mode="tags"
          style={{ width: '100%' }}
          searchPlaceholder="Enter a tag"
          onChange={this.handleChange}
          onSearch={this.handleSearch}
          {...other}
        >
          {items}
        </Select>
      </div>
    );
  }
}

TagsSelectControlled.propTypes = {
  id: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
};

export default TagsSelectControlled;
