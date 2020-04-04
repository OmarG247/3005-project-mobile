import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, TextInput, Modal, Alert } from 'react-native';
import * as imagePicker from 'expo-image-picker';
import { generalStyles, colors } from '../../App.styles';
import StoreStyles from './Store.styles';
import BookStyles from '../BookCard/BookCard.styles';
import books from '../../util/files';
import BookCard from '../../components/BookCard/BookCard';
import { Header } from '../../components/Shared/SharedComponents';
import newbook from '../../assets/img/newbook.png';
import emptyCover from '../../assets/img/emptyCover.png';

interface StoreState {
  bookList: any,
  order: bookUnit [],
  userAdmin: boolean,
  search: null | string,
  showNewBook: boolean,
  newBook: newBook,
}

interface StoreProps {
}

interface newBook {
  thumbnailUrl: string | null,
  title: string | null,
  authors: string | null,
  publishedYear: string | null,
  categories: string | null, 
  isbn: string | null,
  price: string | null,
  pageCount: string | null,
  stock: string | null
}

interface bookUnit {
  book: any,
  quantity: number
}

const newBookInit = {
  thumbnailUrl: null,
  title: null,
  authors: null,
  publishedYear: null,
  categories: null, 
  isbn: null,
  price: null,
  pageCount: null,
  stock: null
}

const bookInputInfo = {
  title: 'title',
  authors: 'authors',
  publishedYear: 'year published',
  categories: 'categories',
  pageCount: 'number of pages',
  isbn: 'ISBN',
  price: 'price',
  stock: 'stock (> 20)'
}

export default class Store extends React.Component<StoreProps, StoreState> {
  constructor(props) {
    super(props);
    this.state = {
      bookList: books.sort((a: any, b: any) => parseInt(b.publishedYear) - parseInt(a.publishedYear)),
      order: [],
      userAdmin: true,
      search: null,
      showNewBook: false,
      newBook: newBookInit,
    }
  }

  addToCart = (newId) => {
    const { order, bookList } = this.state;
    const newOrder = order;
    newOrder.push({ book: bookList[bookList.findIndex((currBook) => currBook.id === newId)], quantity: 1 });

    this.setState({ order: newOrder })
  }

  removeFromCart = (target) => {
    const { order } = this.state;
    const newOrder = order;
    
    newOrder.splice(order.findIndex((currItem) => currItem.book.id === target), 1);
    this.setState({ order: newOrder })
  }

  removeFromStore = (targetId) => {
    const { bookList } = this.state;
    const newList = bookList;
    newList.splice(newList.findIndex((item) => item.id === targetId), 1);

    this.setState({ bookList: newList })
  }
  
  updateBookList = (input) => {
    const { bookList } = this.state;
    this.setState({ search: input })

    if (input) {
      const currList = bookList.filter((book) => {
        return (book.title.toUpperCase().includes(input.toUpperCase()))
        || (book.authors.join(' ').toUpperCase().includes(input.toUpperCase()))
        || (book.categories.join(' ').toUpperCase().includes(input.toUpperCase()))
        || (book.publishedYear.toString().includes(input.toUpperCase()))
        || (book.pageCount.toString().includes(input.toUpperCase()))
        || (book.price.toString().includes(input.toUpperCase()))
        || (book.isbn.includes(input.toUpperCase()))
      });
    
      if (currList.length > 0) {
        this.setState({ bookList: currList });
      } else {
        this.setState({ bookList: [] });
      }
    } else {
      this.setState({ bookList: books });
    }
  }

  uploadImage = () => {
    imagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      quality: 0.2,
    }).then((upload) => {
      if (upload.cancelled) {
        Alert.alert(
          'LookinnaBook',
          `That image didn't work, please try again!`,
          [{
            text: 'Done',
            style: 'default'
          }], {
            cancelable: true
          }
        );
      } else {
        this.setState((prevState) => ({
          newBook: {
            ...prevState.newBook,
            thumbnailUrl: upload.uri
          }
        }));
      }
    })
  }

  updateNewBook = (input, type) => {
    this.setState((prevState) => ({
      newBook: {
        ...prevState.newBook,
        [type]: input
      }
    }))
  }

  saveNewBook = () => {
    const { newBook, bookList } = this.state;
    let verified = true;

    Object.keys(newBook).forEach((entry) => {
      try {
        if (newBook[entry] === null 
          || parseInt(newBook['price']) === NaN
          || newBook['price'].length > 4
          || parseInt(newBook['publishedYear']) === NaN
          || parseInt(newBook['publishedYear']) > new Date().getFullYear()
          || parseInt(newBook['pageCount']) === NaN
          || parseInt(newBook['stock']) === NaN
          || parseInt(newBook['stock']) < 20) {
          verified = false;
        }
      } catch {
        
      }
    })

    // console.log(newBook);

    if (verified) {
      const newList = bookList;

      newList.push({
        ...newBook,
        id: `b-${bookList.length + 1}`,
        publishedYear: parseInt(newBook.publishedYear),
        authors: [...newBook.authors.split(',')],
        categories: [...newBook.categories.split(', ')],
        pageCount: parseInt(newBook.pageCount),
        price: parseInt(newBook.price)
      })
      newList.sort((a, b) => parseInt(b.publishedYear) - parseInt(a.publishedYear))

      this.setState({
        showNewBook: false, 
        newBook: newBookInit, 
        bookList: newList
      })
    } else {
      Alert.alert(
        'LookinnaBook',
        `Please verify your information and try again!`,
        [{
          text: 'Done',
          style: 'default'
        }], {
          cancelable: true
        }
      );
    }
  }

  render() {
    const { bookList, userAdmin, order, search, showNewBook, newBook } = this.state;

    // console.log(order);

    return (
      <View style={StoreStyles.storeContainer}>
        <Modal 
          animationType='fade'
          transparent={true}
          visible={showNewBook}
        >
          <View style={generalStyles.overlayContainer}>
            <View style={generalStyles.contentOverlayContainer}>
              <ScrollView style={{ width: '100%', marginBottom: 20 }}>
                <TouchableOpacity onPress={() => this.uploadImage()} style={{ alignSelf: 'center' }}>
                  <Image source={newBook.thumbnailUrl ? {uri: newBook.thumbnailUrl} : emptyCover} style={BookStyles.bookOverlayImage}/>
                </TouchableOpacity>
                <View>
                  {Object.keys(bookInputInfo).map((key, index) => (
                    <TextInput 
                      key={index}
                      value={newBook[key]}
                      onChangeText={(input) => this.updateNewBook(input, key)}
                      style={[generalStyles.header1, StoreStyles.bookInfoInputBox]} 
                      placeholder={bookInputInfo[key]}
                      keyboardType={key === 'price' ? 'number-pad' : 'default'}
                    />
                  ))}
                </View>
              </ScrollView>
              <TouchableOpacity 
                style={generalStyles.closeOverlayButton} 
                onPress={() => this.saveNewBook()}
              >
                <Text style={[generalStyles.actionExit, { color: colors.blue }]}>
                  add book 
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={generalStyles.exitOverlayButton} 
                onPress={() => this.setState({ showNewBook: false, newBook: newBookInit })}
              >
                <Text style={[generalStyles.actionExit, { color: colors.blue }]}>
                  close
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <View style={StoreStyles.headerContainer}>
          <Header title="Store" />
          {userAdmin && (
            <TouchableOpacity onPress={() => this.setState({ showNewBook: true })} style={StoreStyles.newBookButton}>
              <Text style={[generalStyles.header1, { marginRight: 10 }]}>
                new
                {'\n'}
                book
              </Text>
              <Image source={newbook} style={StoreStyles.newBookImage} />
            </TouchableOpacity>
          )}
        </View>
        <TextInput
          onChangeText={(e) => this.updateBookList(e)}
          style={[generalStyles.header1, StoreStyles.searchBox]}
          placeholder="search"
          value={search}
        />
        <ScrollView showsVerticalScrollIndicator={false} style={StoreStyles.bookListConainer}>
          {bookList.map((book, index) => (
            <View key={index}>
              <BookCard
                author={book.authors}
                title={book.title}
                cover={book.thumbnailUrl}
                price={book.price}
                release={book.publishedYear}
                id={book.id}
                isbn={book.isbn}
                genres={book.categories}
                addBook={this.addToCart}
                removeBook={this.removeFromCart}
                type="store"
                numPages={book.pageCount}
              />
              {userAdmin && (
                <TouchableOpacity onPress={() => this.removeFromStore(book.id)}>
                  <Text style={[generalStyles.actionExit, { color: colors.blue, marginBottom: 20, textAlign: 'center' }]}>
                    remove
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </ScrollView>
      </View>
    )
  }
}