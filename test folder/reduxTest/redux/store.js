import { createStore } from 'redux';
import moodReducer from './moodReducer';

const store = createStore(moodReducer);

export default store;