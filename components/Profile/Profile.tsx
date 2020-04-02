import React from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, Modal, ScrollView } from 'react-native';
import ProfileStyles from './Profile.styles';
import { generalStyles, colors } from '../../App.styles';
import { Header } from '../Shared/SharedComponents';

interface OrderProps {

}

interface OrderState {
  currentUser: any | null,
  showOrders: boolean,
  updateBilling: boolean
}

const sampleUser = {
  id: 'usr-01',
  name: 'john',
  userame: 'johnny',
  password: 'luvbooks',
  billingInfo: {
    cardNumber: 123456789,
    expiryDate: new Date(),
    address: '246 Maple Street, Ottawa, ON',
    phoneNumber: '613 XXX XXXX'
  }
}

const sampleOrders = [
  {
    id: 'A23B35S',
    price: 24,
    date: new Date(),
    tracking: 123456
  },
  {
    id: 'A23B45S',
    price: 22,
    date: new Date(),
    tracking: 123457
  },
  {
    id: 'A33B45S',
    price: 21,
    date: new Date(),
    tracking: 123357
  },
  {
    id: 'A23B45S',
    price: 27,
    date: new Date(),
    tracking: 173457
  },
  {
    id: 'A23B47S',
    price: 32,
    date: new Date(),
    tracking: 273457
  },
  {
    id: 'A23B45S',
    price: 25,
    date: new Date(),
    tracking: 173487
  }
]

export default class Profile extends React.Component <OrderProps, OrderState> {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: 'johnny',
      showOrders: false,
      updateBilling: false,
    }
  }

  render() {
    const { currentUser, showOrders, updateBilling } = this.state;

    return (
      <View style={ProfileStyles.profileContainer}>
        <Modal 
          animationType='fade'
          transparent={true}
          visible={showOrders}
        >
          <View style={ProfileStyles.overlayContainer}>
            <View style={ProfileStyles.contentOverlayContainer}>
              <Text style={[generalStyles.cardHeader]}>
                Your order history
              </Text>
              <ScrollView style={{ 
                marginTop: 10, 
                marginBottom: 30, 
                height: 260,
                width: '100%',
              }}>
                {sampleOrders.map((order, index) => (
                  <View style={{ marginTop: 10, flexDirection: 'column' }} key={index}>
                    <View style={{ 
                      flexDirection: 'row', 
                      alignItems: 'center', 
                      justifyContent: 'space-between', 
                      // borderColor: 'red', 
                      // borderWidth: 3 
                    }}>
                      <Text style={[generalStyles.header1, { textAlign: 'left' }]}>
                        {`#${order.id}`}
                      </Text>
                      <Text style={[generalStyles.header1Bold, { textAlign: 'right' }]}>
                        {`$${order.price.toFixed(2)}`}
                      </Text>
                    </View>
                    <View style={{ 
                      flexDirection: 'row', 
                      alignItems: 'center', 
                      justifyContent: 'space-between', 
                      // borderColor: 'red', 
                      // borderWidth: 3 
                    }}>
                      <Text style={[generalStyles.header2]}>
                        {`${order.date.getDate()}/${order.date.getMonth()}/${order.date.getFullYear()}`}
                      </Text>
                      <Text style={[generalStyles.header2]}>
                        {`tracking #${order.tracking}`}
                      </Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
              <TouchableOpacity 
                style={ProfileStyles.closeOverlayButton} 
                onPress={() => this.setState({ showOrders: false })}
              >
                <Text style={[generalStyles.actionExit, { color: colors.blue }]}>
                  done 
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal 
          animationType='fade'
          transparent={true}
          visible={updateBilling}
        >
          <View style={ProfileStyles.overlayContainer}>
            <View style={ProfileStyles.contentOverlayContainer}>
              <Text style={[generalStyles.cardHeader]}>
                Your billing information
              </Text>
              <View style={{ 
                marginBottom: 30,
                width: '100%',
              }}>
                <Text style={[generalStyles.header1, { marginTop: 10 }]}>
                  Card number
                </Text>
                <TextInput style={[generalStyles.header1Bold, {
                  width: '100%',
                  textAlign: 'left',
                  borderBottomColor: 'black',
                  borderBottomWidth: 1
                }]} placeholder={sampleUser.billingInfo.cardNumber.toString()} />

                <Text style={[generalStyles.header1, { marginTop: 10 }]}>
                  Expiry date
                </Text>
                <TextInput style={[generalStyles.header1Bold, {
                  width: '100%',
                  textAlign: 'left',
                  borderBottomColor: 'black',
                  borderBottomWidth: 1
                }]} placeholder={`${sampleUser.billingInfo.expiryDate.getDate()}/${sampleUser.billingInfo.expiryDate.getMonth()}/${sampleUser.billingInfo.expiryDate.getFullYear()}`} />

                <Text style={[generalStyles.header1, { marginTop: 10 }]}>
                  Address
                </Text>
                <TextInput style={[generalStyles.header1Bold, {
                  width: '100%',
                  textAlign: 'left',
                  borderBottomColor: 'black',
                  borderBottomWidth: 1
                }]} placeholder={sampleUser.billingInfo.address} />

                <Text style={[generalStyles.header1, { marginTop: 10 }]}>
                  Phone number
                </Text>
                <TextInput style={[generalStyles.header1Bold, {
                  width: '100%',
                  textAlign: 'left',
                  borderBottomColor: 'black',
                  borderBottomWidth: 1
                }]} placeholder={sampleUser.billingInfo.phoneNumber} />
              </View>
              <TouchableOpacity 
                style={ProfileStyles.closeOverlayButton} 
                onPress={() => this.setState({ updateBilling: false })}
              >
                <Text style={[generalStyles.actionExit, { color: colors.blue }]}>
                  close & save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <View style={ProfileStyles.headerContainer}>
          <Header title="Profile" />
        </View>
        {currentUser === null ? (
          <View style={{ flex: 1, width: '100%', flexDirection: 'column', alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
            <TextInput style={[generalStyles.header1, ProfileStyles.loginBox]} placeholder="username" />
            <TextInput style={[generalStyles.header1, ProfileStyles.loginBox]} placeholder="password" />
            <TouchableOpacity onPress={() => this.setState({ currentUser: 'johnny' })} style={ProfileStyles.loginButton}>
              <Text style={[generalStyles.actionButton]}>
                login 
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ flex: 1, width: '100%', flexDirection: 'column', alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={[generalStyles.header2, { fontSize: 40, textAlign: 'center' }]}>
              {`Hello, ${currentUser}\n`}
              <Text style={[generalStyles.subheader1]}>
                good to see you again
              </Text>
            </Text>
            <TouchableOpacity onPress={() => this.setState({ showOrders: true })} style={{ marginTop: 60 }}>
              <Text style={[generalStyles.actionButton, { color: colors.blue }]}>
                orders 
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.setState({ updateBilling: true })} style={{ marginTop: 20 }}>
              <Text style={[generalStyles.actionButton, { color: colors.blue }]}>
                billing information 
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.setState({ currentUser: null })} style={ProfileStyles.loginButton}>
              <Text style={[generalStyles.actionButton]}>
                log out 
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
}