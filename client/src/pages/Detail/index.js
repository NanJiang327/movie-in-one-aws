import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import axios from 'axios'

import Movie from '../../components/Movie'
import Loading from '../../components/Loading'
import Cast from '../../components/Cast'
import Review from '../../components/Review'
import config from '../../utils/config'
import { Divider, BackTop, Input, Button, Form, message } from 'antd'

class Detail extends Component {

  constructor() {
    super ()
    this.state = {
      ready: false,
      movie: {},
      casts: [],
      reviews: []
    }
  }

  componentDidMount() {
    this.fetchDetail(this.props.match.params.id, this.props.language)
  }

  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(this.props) === JSON.stringify(nextProps)) return
    this.setState({ ready: false })
    this.fetchDetail(nextProps.match.params.id, nextProps.language)
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      const movieId = this.props.match.params.id
      const author = this.props.user.username
      const userId = this.props.user.userId
      const content = values.comment
      if (!err) {
        axios.post('/comment/post', {author, userId, content, movieId})
          .then(res => {
            if (res.data.code === 0) {
              this.props.form.resetFields()
              message.success('Posted', 2)
              this.fetchReviews()
            } else {
              message.error('Fail to submit the comment', 2)
            }
          })
      }
    });
  }

  fetchReviews = () => {
    const movieId = this.props.match.params.id 
    axios.get('/comment/'+movieId)
      .then(localReviewRes => {
        if (localReviewRes.status === 200 && localReviewRes.data.code === 0) {
          this.setState({
            reviews: [...this.state.reviews, ...localReviewRes.data.data],
          })
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  fetchDetail = (id, language) => {
    const movieId = this.props.match.params.id 
    let castApi = config.tmdb.basicUrl + id +'/credits?api_key=' + config.tmdb.apiKey
    let movieApi = config.tmdb.basicUrl + id + '?api_key=' + config.tmdb.apiKey +'&language=' + language
    let reviewApi = config.tmdb.basicUrl + movieId + '/reviews?api_key=' + config.tmdb.apiKey
    axios.all([
      axios.get(castApi),
      axios.get(movieApi),
      axios.get(reviewApi),
    ])
      .then(axios.spread((castRes, movieRes, reviewRes) => {
        this.setState({
          movie: movieRes.data,
          overview: movieRes.data.overview,
          casts: castRes.data.cast,
          reviews: reviewRes.data.results,
          ready: true
        })
      }))
      .catch((err) => {
        console.log(err)
      })

    axios.get('/comment/'+movieId)
      .then(localReviewRes => {
        if (localReviewRes.status === 200 && localReviewRes.data.code === 0) {
          this.setState({
            reviews: [...this.state.reviews, ...localReviewRes.data.data],
          })
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  render () {
    const { getFieldDecorator } = this.props.form;

    if (!this.state.ready) return <Loading />

    let casts = this.state.casts.map((cast, castId) => {
      return castId < 4 ? <Cast {...cast} key={castId} /> : null
    })
    
    return (
      <div>
       <Movie data={this.state.movie} language={this.props.language} appBackground />
        <section className="subject-casts">
          <Divider className="casts-title">
            {
              this.props.language === 'zh-CN' ? '主演' : 'Top cast'
            }
          </Divider>
          <div className="subject-casts-flex">
            {casts}
          </div>
        </section>
        <section className="subject-content">
          <div className="title">
            {
              this.props.language === 'zh-CN' ? '剧情简介' :'Overview'
            }  
          </div>
          <p>
            {
              this.state.overview ? this.state.overview : this.props.language === 'zh-CN' ? '暂无简介' : 'No overview'
            }
          </p>
        </section>
        <section className="subject-reviews">
          <Review reviews={this.state.reviews} ready={this.state.ready} />
        </section>
        <section className="subject-comment">
          {
            this.props.user.logged ? 
              <Form onSubmit={this.handleSubmit} className="comment-form">
                <Form.Item>
                  {getFieldDecorator('comment', {
                    rules: [
                      { required: true, message: 'Please say something!' },
                      { min: 10, message: 'At least 10 words.'}
                    ],
                  })(
                    <Input.TextArea placeholder="Say something :)" autosize={{ minRows: 6, maxRows: 6 }} />
                  )}
                </Form.Item>
        
                <Form.Item>
                  <Button type="primary" htmlType="submit" className="comment-form-button">
                    Submit
                  </Button>
                </Form.Item>
              </Form> : 
              <div className="comment-login-container">
                <Link to='/login'>Login to comment this movie</Link>
              </div>
          }
          
        </section>
        <BackTop>
          <div className="ant-back-top-inner">UP</div>
        </BackTop>
      </div>
    )
  }

}

const WrappedNormalCommentForm = Form.create({ name: 'normal_comment' })(Detail);

function mapStateToProps(state) {
  return {
    language: state.language,
    user: state.user
  };
}

export default connect(
  mapStateToProps
)(WrappedNormalCommentForm);