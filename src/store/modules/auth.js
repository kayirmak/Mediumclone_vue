import authApi from '@/api/auth'
import { setItem } from '@/helpers/persistanceStorage'

const state = {
  isSubmitting: false,
  isLoading: false,
  currentUser: null,
  validationError: null,
  isLoggedIn: null
}

export const mutationTypes = {
  registerStart: '[auth] registerStart',
  registerSuccess: '[auth] registerSuccess',
  registerFailure: '[auth] registerFailure',

  loginStart: '[auth] loginStart',
  loginSuccess: '[auth] loginSuccess',
  loginFailure: '[auth] loginFailure',

  getCurrentUserStart: '[auth] getCurrentUserStart',
  getCurrentUserSuccess: '[auth] getCurrentUserSuccess',
  getCurrentUserFailure: '[auth] getCurrentUserFailure',
}

export const actionTypes = {
  register: '[auth] register',
  login: '[auth] login',
  getCurrentUser: '[auth] getCurrentUser'
}

export const getterTypes = {
  currentUser: '[auth] currentUser',
  isLoggedIn: '[auth] isLoggedIn',
  isAnonymous: '[auth] isAnonymous'
}

const getters = {
  [getterTypes.currentUser]: state => {
    return state.currentUser
  },
  [getterTypes.isLoggedIn]: state => {
    return Boolean(state.isLoggedIn)
  },
  [getterTypes.isAnonymous]: state => {
    return state.isLoggedIn === false
  }
}

const mutations = {
  [mutationTypes.registerStart](state) {
    state.isSubmitting = true
    state.validationError = null
  },
  [mutationTypes.registerSuccess](state, payload) {
    state.isSubmitting = false
    state.currentUser = payload
    state.isLoggedIn = true
  },
  [mutationTypes.registerFailure](state, payload) {
    state.isSubmitting = false
    state.validationError = payload
  },

  [mutationTypes.loginStart](state) {
    state.isSubmitting = true
    state.validationError = null
  },
  [mutationTypes.loginSuccess](state, payload) {
    state.isSubmitting = false
    state.currentUser = payload
    state.isLoggedIn = true
  },
  [mutationTypes.loginFailure](state, payload) {
    state.isSubmitting = false
    state.validationError = payload
  },

  [mutationTypes.getCurrentUserStart](state) {
    state.isLoading = true
  },
  [mutationTypes.getCurrentUserSuccess](state, payload) {
    state.isLoading = false
    state.currentUser = payload
    state.isLoggedIn = true
  },
  [mutationTypes.getCurrentUserFailure](state) {
    state.isLoading = false
    state.isLoggedIn = false
    state.currentUser = null
  }
}

const actions = {
  [actionTypes.register](context, credentials) {
    return new Promise(resolve =>{
      context.commit(mutationTypes.registerStart)
      authApi.register(credentials).then(response => {
        context.commit(mutationTypes.registerSuccess, response.data.user)
        setItem('accessToken', response.data.user.token)
        resolve(response.data.user)
      })
      .catch(result => {
        context.commit(mutationTypes.registerFailure, result.response.data.errors )
      })
    })
  },

  [actionTypes.login]({commit}, credentials) {
    return new Promise(resolve => {
      commit(mutationTypes.loginStart)
      authApi.login(credentials).then(response => {
        commit(mutationTypes.loginSuccess, response.data.user)
        setItem('accessToken', response.data.user.token)
        resolve(response.data.user)
      })
      .catch(result => {
        commit(mutationTypes.loginFailure, result.response.data.errors)
      })
    })
  },

  [actionTypes.getCurrentUser]({commit}) {
    return new Promise(resolve => {
      commit(mutationTypes.getCurrentUserStart)
      authApi
        .getCurrentUser()
        .then(response => {
          commit(mutationTypes.getCurrentUserSuccess, response.data.user)
          resolve(response.data.user)
        })
        .catch(() => {
          commit(mutationTypes.getCurrentUserFailure)
        })
    })
  }
}
export default {
  state,
  mutations,
  actions,
  getters
}
