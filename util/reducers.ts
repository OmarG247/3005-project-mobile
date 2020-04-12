import { combineReducers } from 'redux';
import books from '../data/starterData';
import users from '../data/starterUsers';
import { User } from './Schemas';

interface INITIAL_STATE_INTERFACE {
  books: any,
  bookList: any [],
  order: any [],
  userStatus: boolean,
  currUser: any
}

const INITIAL_STATE: INITIAL_STATE_INTERFACE = {
  books,
  bookList: books.sort((a: any, b: any) => parseInt(b.publishedYear) - parseInt(a.publishedYear)),
  order: [],
  userStatus: false,
  currUser: null
};

const bookStoreReducer = (state = INITIAL_STATE, action) => {
  const { order, bookList } = state;
  const newOrder = order;
  const newBookList = bookList;

  switch (action.type) {
    case 'ADD_BOOK':
      newOrder.push(action.payload);

      return { ...state, order: newOrder };

    case 'REMOVE_BOOK':
      newOrder.splice(action.payload, 1);

      return { ...state, order: newOrder };

    case 'ADD_BOOK_STORE':
      newBookList.push(action.payload);
      newBookList.sort((a: any, b: any) => parseInt(b.publishedYear) - parseInt(a.publishedYear))

      return { ...state, bookList: newBookList, order: [] }

    case 'REMOVE_BOOK_STORE':
      newBookList.splice(action.payload, 1);

      return { ...state, bookList: newBookList, order: [] }

    case 'INCREASE_BOOK':
      newOrder[action.payload].quantity++;
      return { ...state, order: newOrder };

    case 'DECREASE_BOOK':
      newOrder[action.payload].quantity--;

      return { ...state, order: newOrder };

    // case 'LOG_IN': 
    //   const validateUser = appUsers.findIndex((user) => user.password === action.payload.inputPassword && user.username === action.payload.inputUsername);

    //   if (validateUser > -1) {
    //     return { ...state, currUser: appUsers[validateUser] };
    //   } else {
    //     return { ...state };
    //   }

    case 'LOG_OUT': 

      return { ...state, currUser: null };

    // case 'NEW_USER':
    //   const newUser = {
    //     ...initialUser,
    //     id: (`u-${appUsers.length + 1}`),
    //     username: action.payload.inputUsername,
    //     password: action.payload.inputPassword
    //   }
    //   newUsers.push(newUser);
      
    //   return { ...state, appUsers: newUsers }

    default:
      return state
  }
};

export default combineReducers({
  bookAppStore: bookStoreReducer,
});