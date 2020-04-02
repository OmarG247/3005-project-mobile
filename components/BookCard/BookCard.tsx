import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Button, Modal } from 'react-native';
import selected from '../../assets/img/selected.png';
import unselected from '../../assets/img/unselected.png';
import { generalStyles, colors } from '../../App.styles';
import BookStyles from './BookCard.styles';

const BookCard = ({ title, author, price, cover, release, id, isbn, genres, addBook, removeBook, isSelected = false, type }) => {
  const [bookSelected, setSelection] = useState(isSelected)
  const [showOverlay, setOverlay] = useState(false)

  useEffect(() => {
    if (type === 'store') {
      if (!bookSelected) {
        addBook(id);
      } else {
        removeBook(id);
      }
    }
    
    if (type === 'order') {
      if (!bookSelected) {
        removeBook(id);
      }
    }
  }, [bookSelected]);

  return (
    <View style={BookStyles.cardContainer}>
      <Modal 
        animationType='fade'
        transparent={true}
        visible={showOverlay}
      >
        <View style={BookStyles.overlayContainer}>
          <View style={BookStyles.bookOverlayContainer}>
            <Image source={{ uri: cover }} style={BookStyles.bookOverlayImage}/>
            <Text style={[generalStyles.subheader2, BookStyles.bookOverlayLabel]}>
              title
            </Text>
            <Text style={[generalStyles.header1, BookStyles.bookOverlayText]}>
              {title}
            </Text>
            <Text style={[generalStyles.subheader2, BookStyles.bookOverlayLabel]}>
              authors
            </Text>
            <Text style={[generalStyles.subheader1, BookStyles.bookOverlayText]}>
              {author.join(', ')}
            </Text>
            <Text style={[generalStyles.subheader2, BookStyles.bookOverlayLabel]}>
              release
            </Text>
            <Text style={[generalStyles.header1, BookStyles.bookOverlayText]}>
              {release.slice(0, 4)}
            </Text>
            <Text style={[generalStyles.subheader2, BookStyles.bookOverlayLabel]}>
              categories
            </Text>
            <Text style={[generalStyles.header1, BookStyles.bookOverlayText]}>
              {genres.join(', ')}
            </Text>
            <Text style={[generalStyles.subheader2, BookStyles.bookOverlayLabel]}>
              ISBN
            </Text>
            <Text style={[generalStyles.header1, BookStyles.bookOverlayText]}>
              {isbn}
            </Text>
            <Text style={[generalStyles.subheader2, BookStyles.bookOverlayLabel]}>
              price
            </Text>
            <Text style={[generalStyles.header1, BookStyles.bookOverlayText]}>
              {`$${price}`}
            </Text>
            <TouchableOpacity 
              style={BookStyles.closeOverlayButton} 
              onPress={() => setOverlay(!showOverlay)}
             >
              <Text style={[generalStyles.actionExit, { color: colors.blue }]}>
                done ->
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TouchableOpacity onPress={() => setOverlay(!showOverlay)} style={BookStyles.descriptionContainer}>
        <Image source={{uri: cover}} style={BookStyles.bookCover} />
        <View style={BookStyles.textContainer}>
          <Text style={generalStyles.header1}>
            {title}
          </Text>
          <Text style={[generalStyles.header2, { marginTop: 4 }]}>
            {author.join(', ')}
          </Text>
          <Text style={[generalStyles.subheader2, { marginBottom: 4 }]}>
            {release.slice(0, 4)}
          </Text>
          <Text style={[generalStyles.header3, { bottom: 0, right: 14, position: 'absolute'}]}>
            {`$${price}`}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={BookStyles.bookmarkButton} onPress={() => setSelection(!bookSelected)}>
        <Image style={BookStyles.bookmarkImage} source={bookSelected ? selected : unselected} />
      </TouchableOpacity>
    </View>
  )
}

export default BookCard;