import { saveState } from '../utils/storage'
import * as constants from './constants'

const defaultState = {
  isFetching: false,
  nowShowingArr: [],
  upcomingArr: [],
  type: 'now_playing',
  language: 'en-AU',
  user: {
    logged: false,
    username: '',
    email: '',
    userId: ''
  },
  redirectTo: '',  
  errorMsg: ''
}

export default (state = defaultState, action) => {
  switch(action.type) {
    case constants.FETCH_STARTED:
      return Object.assign({}, state,  {
        isFetching: true
      })
    case constants.FETCH_NOWSHOWING_COMPLETED: {
      const{ nowShowingArr, updatedAt } = action.payload;
      const newState = Object.assign({}, state, {
        isFetching: false,
        nowShowingArr,
        updatedAt,
        type: 'now_playing'
      })
      return newState
    }
    case constants.FETCH_UPCOMING_COMPLETED: {
      const{ upcomingArr, updatedAt } = action.payload;
      const newState = Object.assign({}, state, {
        isFetching: false,
        upcomingArr,
        updatedAt,
        type: 'upcoming'
      })
      return newState
    }
    case constants.FETCH_FAILED:
      return Object.assign({}, state, {
        isFetching: false
      })
    case constants.CHANGE_TYPE: 
      return Object.assign({}, state, {
        type: action.fetchingType
      })
    case constants.CHANGE_LANG:
      saveState({
        language: action.language
      })
      return Object.assign({}, state, {
        language: action.language
      })
    case constants.REGISTER:
      return Object.assign({}, state, {
        user: {
          logged: true,
          username: action.payload.username,
          email: action.payload.email,
          usrId: action.payload['_id'],
        },
        language: action.payload.language
      })
    case constants.SET_REDIRECT:
      return Object.assign({}, state, {
        redirectTo: action.redirectTo
      })
    case constants.ERROR_MESSAGE:
      return Object.assign({}, state, {
        errorMsg: action.err
      })
    case constants.LOGIN:
      return Object.assign({}, state, {
        user: {
          logged: true,
          username: action.payload.username,
          email: action.payload.email,
          userId: action.payload['_id']
        },
        language: action.payload.language
      })
    case constants.LOGOUT:
      return Object.assign({}, state, {
        user: {
          logged: false,
          username: '',
          email: '',
          userId: ''
        },
        language: 'en-AU'
      })
    case constants.LOAD_DATA:
      return Object.assign({}, state, {
        user: {
          logged: true,
          username: action.payload.username,
          email: action.payload.email,
          userId: action.payload['_id']
        },
        language: action.payload.language
      })
    default: 
      return state
  }
}