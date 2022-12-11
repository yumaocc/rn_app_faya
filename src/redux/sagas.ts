import {all, fork} from 'redux-saga/effects';

import commonSagas from './common/sagas';
import contractSagas from './contract/sagas';
import merchantSagas from './merchant/sagas';
import SKUSagas from './sku/sagas';
import summarySagas from './summary/sagas';
import userSagas from './user/sagas';

function* rootSaga() {
  yield all([fork(userSagas), fork(commonSagas), fork(merchantSagas), fork(SKUSagas), fork(contractSagas), fork(summarySagas)]);
}

export {rootSaga};
