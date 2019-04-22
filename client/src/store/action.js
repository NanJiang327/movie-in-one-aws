import axios from 'axios'
import * as constants from './constants'
import config from '../utils/config'

const getNowShowingData = (res) => ({
  type: constants.FETCH_NOWSHOWING_COMPLETED,
  payload: {
    nowShowingArr: res
  }
})

const getUpcomingData = (res) => ({
  type: constants.FETCH_UPCOMING_COMPLETED,
  payload: {
    upcomingArr: res
  }
})

export const setRedirect = (redirectTo) => ({
  type: constants.SET_REDIRECT,
  redirectTo
})

export const changeLang = (language) => ({
  type: constants.CHANGE_LANG,
  language
})

export const setErrorMsg = (msg) => ({
  type: constants.ERROR_MESSAGE,
  err: msg
})

export function fetchData(fetchingType, language) {
  return (dispatch, getState) => {
    if (fetchingType !== getState().type) {
       dispatch({
        type: constants.CHANGE_TYPE,
        fetchingType
      })
    }
    
    dispatch({
      type: constants.FETCH_STARTED
    });

    const api = config.tmdb.basicUrl + fetchingType +'?api_key=' + config.tmdb.apiKey + '&language='+ language +'&page=1&region=AU'
    const type = fetchingType === 'now_playing' 

    axios.get(api)
      .then(res => {
        const results = res.data.results;
        if (type) {
          return dispatch(getNowShowingData(results))
        } else {
          return dispatch(getUpcomingData(results))
        }
      })
      .catch(err => {
        return dispatch({
          type: constants.FETCH_FAILED,
          error: true,
          payload: err
        });
      })
    
  }
}

export function register(values) {
  return (dispatch, getState) => {
    const {username, email, password, language} = values
    axios.post('/user/register', {username, email, password, language})
      .then(res => {
        if (res.status === 200 && res.data.code === 0) {
          dispatch({
              type: constants.REGISTER,
              payload: values
          })
          dispatch(setRedirect('/'))
          dispatch(changeLang(language))
          dispatch(setErrorMsg(''))
        } else {
          dispatch(setErrorMsg(res.data.msg))
        }
      })
      .catch(err =>{
        console.log(err)
      })
  }
}

export function login(values) {
  return (dispatch, getState) => {
    const { username, password } = values
    axios.post('/user/login', {username, password})
      .then(res => {
        if (res.status === 200 && res.data.code === 0) {
          dispatch({
              type: constants.LOGIN,
              payload: res.data.data
          })
          dispatch(setRedirect(getState().redirectTo))
          dispatch(changeLang(res.data.data.language))
          dispatch(setErrorMsg(''))
        } else {
          dispatch(setErrorMsg(res.data.msg))
        }
      })
      .catch(err =>{
        console.log(err)
      })
  }
}

export function logout() {
  return (dispatch, getState) => {
    axios.get('/user/logout')
      .then(res => {
        dispatch({
          type: constants.LOGOUT
        })
      })
      .catch(err =>{
        console.log(err)
      })
  }
}

export function loadData() {
  return (dispatch, getState) => {
    axios.get('/user/info')
      .then(res => {
        if (res.data.code === 0) {
          dispatch({
            type: constants.LOAD_DATA,
            payload: res.data.data
          })
        }
      })
      .catch(err =>{
        console.log(err)
      })
  }
}