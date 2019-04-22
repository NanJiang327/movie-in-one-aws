import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  Form, Icon, Input, Button, message
} from 'antd';
import { Redirect } from 'react-router-dom'
import  { login, setErrorMsg } from '../../store/action'

class Login extends Component {

  state = {

  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.login(values)
      } else {
        message.error('Please check your input.', 2)
      }
    });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.errorMsg !== '') {
      message.error(nextProps.errorMsg, 2)
      return nextProps.setErrorMsg('')
    }
    
    return null
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        {this.props.user.logged ? <Redirect to={this.props.redirectTo} /> : null}
        <Form onSubmit={this.handleSubmit} className="login-form">
          <Form.Item>
            {getFieldDecorator('username', {
              rules: [
                { required: true, message: 'Please input your username!' },
                {
                  min: 5, max: 10,
                  message: 'The length of username should between 5 and 10.'
                }, {
                  pattern:new RegExp('^\\w+$','g'),
                  message:'The usernmae can only contain number and characters.'
                }
              ],
            })(
              <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('password', {
              rules: [
                { required: true, message: 'Please input your Password!' },
                {
                  min: 5,
                  message: 'The length of password should greater than 5.'
                }, 
              ],
            })(
              <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
            )}
          </Form.Item>
          <Form.Item>
            {/* {getFieldDecorator('remember', {
              valuePropName: 'checked',
              initialValue: true,
            })(
              <Checkbox className="label">Remember me</Checkbox>
            )}
            <a className="login-form-forgot" href="/">Forgot password</a> */}
            <Button type="primary" htmlType="submit" className="login-form-button">
              Log in
            </Button>
            <span className="label">Or </span>
            <Link to='/register' >register now!</Link>
          </Form.Item>
        </Form>
      </div>
    )
  }
}

const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(Login);

function mapStateToProps(state) {
  return {
    user: state.user,
    redirectTo: state.redirectTo,
    errorMsg: state.errorMsg
  };
}

function mapDispatchToProps(dispatch) {
  return {
    login: (values) => dispatch(login(values)),
    setErrorMsg: (msg) => dispatch(setErrorMsg(msg))
  };
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WrappedNormalLoginForm);