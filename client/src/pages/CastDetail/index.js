import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import axios from 'axios'
import { BackTop } from 'antd'

import Loading from '../../components/Loading'
import Rating from '../../components/Rating'
import config from '../../utils/config'


class CastDetail extends Component {

  constructor(){
    super()
    this.state = {
      ready: false,
      productions: [],
      detail: {}
    }
  }

  componentDidMount () {
    this.fetchProduction(this.props)
  }

  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(this.props) === JSON.stringify(nextProps)) return
    this.setState({ ready: false })
    this.fetchProduction(nextProps)
  }

  fetchProduction = (props) => {
    let productionApi = `${config.tmdb.castUrl + props.match.params.id}/movie_credits?api_key=${config.tmdb.apiKey}&language=${props.language}`
    let detailApi = `${config.tmdb.castUrl + props.match.params.id}?api_key=${config.tmdb.apiKey}&language=${props.language}`
    axios.all([
      axios.get(productionApi),
      axios.get(detailApi)
    ])
    .then(axios.spread((productionRes, detailRes) => {
        this.setState({ productions: productionRes.data.cast, detail: detailRes.data, ready: true})
    }))
    .catch(err => {
        console.log(err)
    })
  }


  renderProduction = (productions) => {
    let items = productions.map((production, idx) => {
      if (!production['poster_path']) return null
      return (
        <Link key={idx} to={'/detail/' + production.id } className="production" >
          <div className="production__cover">
            <img src={config.tmdb.bgUrl + production['poster_path']} alt=""/>
          </div>
          <Rating rating={production['vote_average']} />
          <span className='production-title'>{production.title}</span>
        </Link>
      )
    })

    return (
      <div className="cast-production">
        <div className="title"></div>
        <div className="cast-production-flex">
          {items}
        </div>
      </div>
    )
  }

  render () {
    if (!this.state.ready) return <Loading />
    const { productions, detail } = this.state
    const backgroundImage = `url(${config.tmdb.bgUrl + productions[0]['poster_path']})`
    return (
      <div className="cast-detail-page">
        <div className="content-title">
          {detail.name}
        </div>
        <div className="cast-profile">
          <div className="cast-image">
            <img src={config.tmdb.bgUrl + detail['profile_path']} alt=""/>
          </div>
          <div className="cast-info">
            <p>
              <span>
                {
                  this.props.language === 'zh-CN' ? '出生地:  ' : 'Place of birth:  '
                }
              </span>
              {
                detail['place_of_birth'] ? detail['place_of_birth'] : '-'
              }
            </p>
          </div>
        </div>
        {this.renderProduction(productions)}
         <div className="app-bg" style={{  backgroundImage }}></div>
         <BackTop>
          <div className="ant-back-top-inner">UP</div>
        </BackTop>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return  {
    language : state.language
  }
}


export default connect(mapStateToProps)(CastDetail)