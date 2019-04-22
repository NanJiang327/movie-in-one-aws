import React from 'react';
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Rate } from 'antd'
import IconFont from './IconFont'

import config from '../utils/config'

const  Movie = ({data, appBackground, language}) => {
  if (!data.title || !data.backdrop_path || !data.poster_path) return null

  let title = data.title === data.original_title ? (
      <div className="subject-title">
       <Link to={'/detail/' + data.id}>
        <div className="title-1">{data.title}</div>
       </Link>
      </div>
  ) : (
      <div className="subject-title">
        <Link to={'/detail/' + data.id}>
          <div className="title-1">{data.title}</div>
          <div className="title-2">{data.original_title}</div> 
        </Link>
      </div>
  )
  let genresType = language === 'zh-CN' ? config.tmdb.genres_cn : config.tmdb.genres_en
  let genres = genresType.filter(item => {
    return data.genre_ids ? data.genre_ids.indexOf(item.id) >= 0
            : data.genres.indexOf(item.id) >= 0
  }).map(
    item => {
      return item.name
    }
  ).join(', ')

  let langOptions = language === 'zh-CN' ? 
    {
      overview: '剧情简介',
      relase: '上映时间',
      genres: '类别',
      no_overviwe: '暂无简介'
    } :
    {
      overview: 'Overview',
      relase: 'Relase date',
      genres: 'Genres',
      no_overviwe: 'No overview'
    }

  let heroClassName = 'subject-hero small';

  let bgClassName = appBackground ? 'app-bg' : 'subject-hero-bg';
  let backgroundImage = appBackground ? `url(${config.tmdb.bgUrl + data.poster_path})` : `url(${config.tmdb.bgUrl + data.backdrop_path})`

  return (
    <section className="subject-header" >
     
      <section className={heroClassName}>
        <div className="subject-hero-container">
          <Link to={'/detail/' + data.id}>
            <img src={config.tmdb.bgUrl + data.poster_path} alt={data.title} />
          </Link>
          <div className="subject-hero-info" >
            {title}
            {
              data.vote_average !== 0 ? <Rate allowHalf defaultValue={(data.vote_average / 2)} disabled/>
               : <div style={{fontSize: '20px', color: '#fadb14', fontWeight: 'blod'}}>No rating</div>
            }
            <div className="wrap text">
              <span>{langOptions.overview}: </span> {data.overview ? data.overview.trim() : langOptions.no_overviwe}
            </div>
            <div className='text'><span>{langOptions.relase}: </span>{(data.release_date).replace(/-/g, '/')}</div>
            <div className='text'><span>{langOptions.genres}: </span> {genres}</div>
              <div className="douban-link">
                <a href={'https://www.themoviedb.org/movie/' + data.id} target="_blank" rel="noopener noreferrer">
                  <IconFont name={'movie'} />
                </a>
              </div>
          </div>
        </div>
        <div className={bgClassName} style={{ backgroundImage }}></div>
      </section>
    </section>
  )

}

Movie.propTypes = {
  data: PropTypes.object,
  lang: PropTypes.string,
  appBg: PropTypes.bool,
}

export default Movie