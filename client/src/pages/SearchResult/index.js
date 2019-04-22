import React, { Component } from 'react';
import Loading from '../../components/Loading'
import { connect } from 'react-redux';
import axios from 'axios'
import config from '../../utils/config'
import MovieList from '../../components/MovieList'
import { BackTop } from 'antd'

class SearchResult extends Component {
  constructor() {
    super()
    this.state = {
      ready: false,
      searchResult: []
    }
  }

  // 
  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(this.props) === JSON.stringify(nextProps)) return
    this.setState({ ready: false })
    this.fetchResult(nextProps.match.params.query, nextProps.language)
  }

  componentDidMount() {
    this.fetchResult(this.props.match.params.query, this.props.language)
  }
  
  fetchResult = (value, language) => {
    const api = config.tmdb.searchUrl + '?query='+ value +'&api_key=' + config.tmdb.apiKey + '&language=' + language +'&page=1'
    axios.get(api)
      .then((res) => {
        this.setState({ searchResult: res.data.results, ready: true})
      }).catch(err => {
        console.log(err)
        // this.setState({ searchResult: [], ready: })
      })
  }

  render () {
    if (!this.state.ready) return <Loading />
    const {language, match} = this.props
    return (
      <div>
        <div className="intheater title">
          {
            language === 'zh-CN' ? 
            match.params.query +'的搜索结果' :
            'Search result for: ' + match.params.query
          }
        </div>
        <MovieList results={this.state.searchResult} language={language}/>
        <BackTop>
          <div className="ant-back-top-inner">UP</div>
        </BackTop>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    language: state.language
  };
}

export default connect(
  mapStateToProps
)(SearchResult);