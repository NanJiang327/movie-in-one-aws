import React, { Component } from 'react'
import IconFont from './IconFont'
import Search from './Search'
import { Link } from 'react-router-dom'
import { Menu, Dropdown, Icon } from 'antd';
import { connect } from 'react-redux';
import { changeLang, logout, loadData } from '../store/action'
import browserCookies from 'browser-cookies'
import axios from 'axios'

class Header extends Component {

  onClick = ({ key }) => {
    this.props.changeLang(key)
    if (this.props.user.logged) {
      console.log(key)
      axios.post('/user/changeLang', {username: this.props.user.username, language: key})
        .then(res => {
          console.log(this.props.language)
        })
        .catch(err =>{
          console.log(err)
        })
    }
  };

  componentDidMount () {
    this.props.loadData()
  }

  clickLogout () {
    browserCookies.erase('connect.sid')
    this.props.logout()
  }

  render () {
    const menu = (
      <Menu
        onClick={this.onClick}
        selectedKeys={[this.props.language]}
      >
        <Menu.Item key='en-AU'>
          English
        </Menu.Item>
        <Menu.Item key='zh-CN'>
          中文
        </Menu.Item>
      </Menu>
    );


    return (
      <div className="header">
        <div className="menu">
          <div className="menu-left">
            <Link to='/' replace>
              <IconFont name={'movie'} />
              Movie in One
            </Link>
          </div>
          <div className="menu-right">
            {
              this.props.user.logged ? 
                <button 
                  onClick={() => {this.clickLogout()}}
                  className="login-btn" 
                >
                  <IconFont name={'acc'} className='movie-title'/>
                  Logout
                </button> :
                <Link 
                  to='/login' 
                  className="login-btn" 
                  replace
                
                >
                  <IconFont name={'acc'} className='movie-title'/>
                  Login
                </Link>
            }
            <Dropdown overlay={menu} className="dropdown-menu">
              <div className="ant-dropdown-link" >
                <IconFont name={'lang'} className='movie-title'/>
                Language<Icon type="down" />
              </div>
            </Dropdown>
            </div>
        </div>
        <Link to='/' className="main-page" >
          <IconFont name={'star'} className='movie-title'/>
        </Link>
        <div className="search-wrapper">
          <Search />
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    language: state.language,
    user: state.user
  }
}

function mapDispatchToProps(dispatch) {
  return {
    changeLang: (language) => dispatch(changeLang(language)),
    logout: () => dispatch(logout()),
    loadData:() => dispatch(loadData())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);