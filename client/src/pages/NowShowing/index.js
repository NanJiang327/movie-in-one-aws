import React, { Component } from 'react'
import { connect } from 'react-redux';

import MovieList from '../../components/MovieList';
import Loading from '../../components/Loading';
import  { fetchData } from '../../store/action'
import { BackTop } from 'antd'



class NowShowing extends Component {
  componentDidMount() {
    this.props.fetchNowShowing(this.props.language);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.language === nextProps.language) return
    if (nextProps.type === 'now_playing') {
      this.props.fetchNowShowing(nextProps.language);
    } else {
      this.props.fetchUpcoming(nextProps.language);
    }
  }

  render (){
    const { fetchNowShowing, fetchUpcoming, type, isFetching, nowShowingArr, upcomingArr, language} = this.props
    if (isFetching) return <Loading />
    const lang = language === 'en-AU' ? {
      showing: 'Now Playing',
      upcoming: 'Upcoming'
    } : 
    {
      showing: '正在上映',
      upcoming: '即将上映'
    }
    return (
      <div>
        <div className="intheater title">
          <button onClick={() => fetchNowShowing(language)} className={type === 'now_playing' ? 'active' :''}>{lang.showing} </button>
          <span> | </span>
          <button onClick={() => fetchUpcoming(language)} className={type === 'upcoming' ? 'active' :''}> {lang.upcoming}</button>
        </div>
        {
          type === 'now_playing' ?
            <MovieList results={nowShowingArr} language={language} />
            : <MovieList results={upcomingArr} language={language} />
        }
        <BackTop>
          <div className="ant-back-top-inner">UP</div>
        </BackTop>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    isFetching: state.isFetching,
    type: state.type,
    nowShowingArr: state.nowShowingArr,
    upcomingArr: state.upcomingArr,
    language: state.language
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchNowShowing: (language) => {
      dispatch(fetchData('now_playing', language))
    },
    fetchUpcoming: (language) => {
      dispatch(fetchData('upcoming', language))
    },
  };
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NowShowing);