import React, { Component } from 'react';
import { connect } from 'react-redux'
import {
  Form, Input, Button, Select, message
} from 'antd';
import  { register } from '../../store/action'
import { Redirect } from 'react-router-dom'


class Registration extends Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
    errorMsg: this.props.errorMsg,
    redirectTo: this.props.redirectTo
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.errorMsg !== '' && nextProps.errorMsg !== prevState.errorMsg) {
      message.error(nextProps.errorMsg, 2)
      nextProps.form.resetFields()
      return ({errorMsg: nextProps.errorMsg})
    }
    
    return null
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.register(values)
      } else {
        message.error('Please check your input.', 2);
      }
    });
  }

  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  }

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 9,
        },
      },
    };

    return (
      <div>
        {
          this.props.user.logged ? 
            <Redirect to={this.props.redirectTo} /> : null
        }
        <Form className="register-form"  onSubmit={this.handleSubmit}>
          <Form.Item>
              {getFieldDecorator('username', {
                rules: [{
                  required: true, message: 'Please input your username!',
                }, {
                  min: 5, max: 10,
                  message: 'The length of username should between 5 and 10.'
                }, {
                  pattern:new RegExp('^\\w+$','g'),
                  message:'The usernmae can only contain number and characters.'
                }],
              })(
                <Input placeholder="Username"/>
              )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('email', {
              rules: [{
                type: 'email', message: 'The input is not valid E-mail!',
              }, {
                required: true, message: 'Please input your E-mail!',
              }],
            })(
              <Input placeholder="E-mail"/>
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('password', {
              rules: [{
                required: true, message: 'Please input your password!',
              },
              {
                  min: 5,
                  message: 'The length of password should greater than 5.'
              }, 
              {
                validator: this.validateToNextPassword,
              }],
            })(
              <Input type="password" placeholder="Password" />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('confirm', {
              rules: [{
                required: true, message: 'Please confirm your password!',
              }, {
                validator: this.compareToFirstPassword,
              }],
            })(
              <Input type="password" placeholder="Confirm Password" onBlur={this.handleConfirmBlur} />
            )}
          </Form.Item>
          <Form.Item
            hasFeedback
          >
            {getFieldDecorator('language', {
              rules: [
                { required: true, message: 'Please select your preferred language!' },
              ],
            })(
              <Select placeholder="Please select your language">
                <Select.Option value="en-AU">English</Select.Option>
                <Select.Option value="zh-CN">中文</Select.Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">Register</Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}


const WrappedNormalRegisterForm = Form.create({ name: 'register' })(Registration);

function mapStateToProps(state) {
  return {
    user: state.user,
    redirectTo: state.redirectTo,
    errorMsg: state.errorMsg,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    register: (values) => {
      dispatch(register(values))
    }
  };
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WrappedNormalRegisterForm);
