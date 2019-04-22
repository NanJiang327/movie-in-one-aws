import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loading from './Loading'
import {
  Comment, List, Avatar
} from 'antd';

class Review extends Component {
  render () {
    if (!this.props.ready) return <Loading />
    return (
      <div>
        {
          <List
            className="comment-list"
            header={'Reviews'}
            itemLayout="horizontal"
            dataSource={this.props.reviews}
            renderItem={item => (
              <Comment
                author={<a href={item.url}>{item.author}</a>}
                content={(
                  <p>{item.content}</p>
                )}
                avatar={(
                <Avatar
                  src="https://pic2.zhimg.com/80/v2-1e02c1531c33f9460ae82eb88a999cdd_hd.jpg"
                />
                 )}
              />
            )}
          /> 
        }
      </div>
    )

  }
}

const mapStateToProps = (state) => {
  return {
    language: state.language,
    user: state.user
  }
}

export default connect(mapStateToProps)(Review)