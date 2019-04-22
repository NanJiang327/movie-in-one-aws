import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import IconFont from './IconFont'
import debounce from 'lodash.debounce'
import axios from 'axios'
import { connect } from 'react-redux';
import config from '../utils/config'

class Search extends Component {
  constructor() {
    super()
    this.fetchData = debounce(this.fetchData, 300)
    this.state = { focused: false, searchResult: [], showSearchMenu: false}
  }

  componentDidMount () {
    document.addEventListener('click', ()=> {this.setState({ showSearchMenu: false})})
  }

  fetchData = (value) => {
    const api = config.tmdb.searchUrl + '?query='+ value +'&api_key=' + config.tmdb.apiKey + '&language=' + this.props.language +'&page=1'
    if (!value) return this.setState({ showSearchMenu: false })
    this.setState({ showSearchMenu: true })
    axios.get(api)
      .then((res) => {
        this.setState({ searchResult: res.data.results})
      }).catch(err => {
        console.log(err)
      })
  }

  onKeyDown = e => {
    if (e.keyCode === 13) {
      let path = '/search/' + this.refs.input.value;
      this.refs.input.value = '';
      this.props.history.push(path);
      this.setState({ searchResult: [], showSearchMenu: false})
    }
  };

  handleInput = (e) => {
    this.fetchData(e.target.value)
  }

  handleClick = (e) => {
    this.refs.input.value = ''
    this.setState({
      searchResult:[]
    })
  }


  render () {
    let searchBarClassName = this.state.focused
      ? 'search-bar focused'
      : 'search-bar';

    return (
      <div className={searchBarClassName}>
        <div className="search-icon">
          <IconFont name={'search'} />
        </div>
        <input
          className="search-input"
          ref="input"
          type="text"
          onKeyDown={this.onKeyDown}
          onChange={this.handleInput}
          onFocus={() => this.setState({ focused: true })}
          onBlur={() => this.setState({ focused: false })}
          placeholder="Search for a movie..."
        />
        {
          (this.state.showSearchMenu && this.state.searchResult.length >= 0)? 
          <ul className="dropdown-menu ">
            {
              this.state.searchResult.length !== 0 ?
                this.state.searchResult.map((movie, index) => {
                  return index <= 5 ? (
                    <li key={movie.id} className="suggestion" onClick={this.handleClick}>
                      <Link to={'/detail/' + movie.id}>
                        {movie.title}
                      </Link>
                    </li>
                  ) : null
                }) : <li>No search result</li>
            }
          </ul> : null
        }
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    language: state.language
  }
}


export default connect(
  mapStateToProps
)(withRouter(Search));