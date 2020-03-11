/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React, { Component } from 'react';
import PropTypes, { ReactNodeLike, Requireable } from 'prop-types';
import { EuiFormRow, EuiDualRange, EuiRangeProps } from '@elastic/eui';
import { EuiFormRowDisplayKeys } from '@elastic/eui/src/components/form/form_row/form_row';
import { isRangeValid } from './is_range_valid';

// Wrapper around EuiDualRange that ensures onChange callback is only called when range value
// is valid and within min/max

interface ValidatedRangeValues extends Omit<EuiRangeProps, 'value'> {
  value?: [number | string, number | string] | undefined;
  allowEmptyRange?: boolean;
  label?: string;
  formRowDisplay?: EuiFormRowDisplayKeys;
}

interface ValidateDualRangeState {
  isValid?: boolean;
  errorMessage?: string;
  value: [number | string, number | string];
}

export class ValidatedDualRange extends Component<ValidatedRangeValues> {
  static defaultProps: { fullWidth: boolean; allowEmptyRange: boolean; compressed: boolean };
  static propTypes: {
    fullWidth: Requireable<boolean>;
    allowEmptyRange: Requireable<boolean>;
    formRowDisplay: Requireable<string>;
    compressed: Requireable<boolean>;
    label: Requireable<ReactNodeLike>;
  };

  static getDerivedStateFromProps(nextProps: ValidatedRangeValues, prevState: any) {
    if (nextProps.value !== prevState.prevValue) {
      const { isValid, errorMessage } = isRangeValid(
        nextProps.value,
        nextProps.min,
        nextProps.max,
        nextProps.allowEmptyRange
      );
      return {
        value: nextProps.value,
        prevValue: nextProps.value,
        isValid,
        errorMessage,
      };
    }

    return null;
  }

  state: ValidateDualRangeState = {
    value: ['0', '0'],
  };

  _onChange = (value: any) => {
    const { isValid, errorMessage } = isRangeValid(
      value,
      this.props.min,
      this.props.max,
      this.props.allowEmptyRange
    );

    this.setState({
      value,
      isValid,
      errorMessage,
    });

    if (this.props.onChange) {
      this.props.onChange(value, isValid);
    }
  };

  render() {
    const {
      compressed,
      fullWidth,
      label,
      formRowDisplay,
      value, // eslint-disable-line no-unused-vars
      onChange, // eslint-disable-line no-unused-vars
      allowEmptyRange, // eslint-disable-line no-unused-vars
      // @ts-ignore
      ...rest
    } = this.props;

    return (
      <EuiFormRow
        compressed={compressed}
        fullWidth={fullWidth}
        isInvalid={!this.state.isValid}
        error={this.state.errorMessage ? [this.state.errorMessage] : []}
        label={label}
        display={formRowDisplay}
      >
        <EuiDualRange
          compressed={compressed}
          fullWidth={fullWidth}
          value={this.state.value}
          onChange={this._onChange}
          // @ts-ignore
          focusable={false} // remove when #59039 is fixed
          {...rest}
        />
      </EuiFormRow>
    );
  }
}

ValidatedDualRange.propTypes = {
  allowEmptyRange: PropTypes.bool,
  fullWidth: PropTypes.bool,
  compressed: PropTypes.bool,
  label: PropTypes.node,
  formRowDisplay: PropTypes.string,
};

ValidatedDualRange.defaultProps = {
  allowEmptyRange: true,
  fullWidth: false,
  compressed: false,
};
