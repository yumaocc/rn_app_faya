export enum ActionType {
  LOAD_MERCHANT_CATEGORIES = 'MERCHANT/LOAD_MERCHANT_CATEGORIES',
  LOAD_MERCHANT_CATEGORIES_SUCCESS = 'MERCHANT/LOAD_MERCHANT_CATEGORIES_SUCCESS',
  LOAD_CURRENT_MERCHANT_PRIVATE = 'MERCHANT/LOAD_CURRENT_MERCHANT_PRIVATE',
  LOAD_CURRENT_MERCHANT_PRIVATE_SUCCESS = 'MERCHANT/LOAD_CURRENT_MERCHANT_PRIVATE_SUCCESS',
  LOAD_CURRENT_MERCHANT_PUBLIC = 'MERCHANT/LOAD_CURRENT_MERCHANT_PUBLIC',
  LOAD_CURRENT_MERCHANT_PUBIC_SUCCESS = 'MERCHANT/LOAD_CURRENT_MERCHANT_PUBIC_SUCCESS',
  LOAD_MERCHANT_SEARCH_LIST = 'MERCHANT/LOAD_MERCHANT_SEARCH_LIST',
  LOAD_MERCHANT_SEARCH_LIST_SUCCESS = 'MERCHANT/LOAD_MERCHANT_SEARCH_LIST_SUCCESS',
  LOAD_MERCHANT_LOADING = 'MERCHANT/LOAD_MERCHANT_LOADING',

  LOAD_MERCHANT_PUBLIC_LIST = 'MERCHANT/LOAD_MERCHANT_PUBLIC_LIST',
  LOAD_MERCHANT_PUBLIC_LIST_SUCCESS = 'MERCHANT/LOAD_MERCHANT_PUBLIC_LIST_SUCCESS',

  CHANGE_MERCHANT_LOADING_STATE_PUBLIC = 'MERCHANT/CHANGE_MERCHANT_LOADING_STATE_PUBLIC',
  CHANGE_MERCHANT_LOADING_STATE_PRIVATE = 'MERCHANT/CHANGE_MERCHANT_LOADING_STATE_PRIVATE',
  LOAD_MERCHANT_PRIVATE_LIST = 'MERCHANT/LOAD_MERCHANT_PRIVATE_LIST',
  LOAD_MERCHANT_PRIVATE_LIST_SUCCESS = 'MERCHANT/LOAD_MERCHANT_PRIVATE_LIST_SUCCESS',
  END_EDIT = 'MERCHANT/END_EDIT',
  LOGOUT = 'MERCHANT/LOGOUT',
  //公海loading私海loading
  MERCHANT_PUBLIC_LOADING = 'MERCHANT/MERCHANT_PUBLIC_LOADING',
  MERCHANT_PRIVATE_LOADING = 'MERCHANT/MERCHANT_PRIVATE_LOADING',
}
