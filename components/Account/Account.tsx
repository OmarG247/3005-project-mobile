import React from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal, ScrollView, Alert, Picker } from 'react-native';
import AccountStyles from './Account.styles';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { runQuery } from '../../database';
import { logIn, logOut, updateUser } from '../../util/actions';
import { generalStyles, colors } from '../../App.styles';
import { Header } from '../Shared/SharedComponents';
import { salesPerGenre, salesPerAuthor } from '../../SQL/queries.sql';

interface AccountProps {
  bookAppStore: any,
	logIn: Function,
  logOut: Function,
  updateUser: Function
}

interface AccountState {
  showOrderHistory: boolean,
  showBilling: boolean,
  showTracking: boolean,
  showNewAdmin: boolean,
  showNewPublisher: boolean,
  showDeleteUser: boolean,
  showSales: boolean,
  inputUsername: null | string,
  inputPassword: null | string,
  inputPublisherId: null | string,
  inputPublisherName: null | string,
  inputPublisherAddress: null | string,
  inputPublisherBankNumber: null | string,
  inputPublisherPhone: null | string,
  newAdminSelection: null | string,
  updateExpiryMonth: null | string,
  updateExpiryYear: null | string,
  updateCardNumber: null | string,
  updateAddress: null | string,
  updatePhoneNumber: null | string
  deleteUserSelection: null | string,
  inputTrackOrder: null | string,
  orderStatus: null | string,
  availableUsers: any [],
  orders: any [],
}

class Account extends React.Component <AccountProps, AccountState> {
  constructor(props) {
    super(props);
    this.state = {
      showOrderHistory: false,
      showBilling: false,
      showNewAdmin: false,
      showNewPublisher: false,
      showDeleteUser: false,
      showTracking: false,
      showSales: false,
      inputPassword: null,
      inputUsername: null,
      inputPublisherId: null,
      inputPublisherName: null,
      inputPublisherAddress: null,
      inputPublisherBankNumber: null,
      inputPublisherPhone: null,
      inputTrackOrder: null,
      updateExpiryMonth: null,
      updateExpiryYear: null,
      updateCardNumber: null,
      updateAddress: null,
      updatePhoneNumber: null,
      newAdminSelection: null,
      deleteUserSelection: null,
      orderStatus: null,
      orders: [],
      availableUsers: []
    }
  }

  registerUser = async () => {
    const { inputUsername, inputPassword } = this.state;

    const currUsersAmount = 1 + await runQuery(
      `select * from users;`
    ).then((result: any) => {
      return Promise.resolve(result._array.length);
    });

    const usernameValid = await runQuery(`
      select username 
      from users
      where username = '${inputUsername}';
    `).then((result: any) => {
      if (result._array.length === 0) {
        return Promise.resolve(true);
      } else if (result._array.length === 1) {
        return Promise.resolve(false);
      }
    })

    if (inputUsername && inputPassword) {
      if (usernameValid) {
        runQuery(`
          insert into users (
            user_ID, role_ID, username, password
          )
          values (
            'u-${(currUsersAmount > 10 ? currUsersAmount : ('0' + currUsersAmount))}', 'r-01', '${inputUsername}', '${inputPassword}'
          );
        `).then(() => {
          runQuery(`
            select * from users;
          `).then((result: any) => {
            // console.log('updated users:');
            // console.log(result._array);

            Alert.alert(
              'LookinnaBook',
              `New user has been created!`,
              [{
                text: 'Done',
                style: 'default'
              }], {
                cancelable: true
              }
            );
          })
        })
      } else {
        Alert.alert(
          'LookinnaBook',
          `That username is already taken!`,
          [{
            text: 'Done',
            style: 'default'
          }], {
            cancelable: true
          }
        );
      }
    } else {
      Alert.alert(
        'LookinnaBook',
        `Please enter a valid username and password`,
        [{
          text: 'Done',
          style: 'default'
        }], {
          cancelable: true
        }
      );
    }
  }

  deleteAccount = (target?: string) => {
    const { deleteUserSelection } = this.state;

    const targetUser = target || deleteUserSelection;

    runQuery(`
      delete from users
      where username = '${targetUser}'
    `).then((result: any) => {
      Alert.alert(
        'LookinnaBook',
        `The user ${targetUser} has been deleted!`,
        [{
          text: 'Done',
          style: 'default'
        }], {
          cancelable: true
        }
      );

      if (target) {
        this.props.logOut();
      }

      this.setState({ showDeleteUser: false })
    })
  }

  userLogin = () => {
    const { inputPassword, inputUsername } = this.state;

    if (inputPassword && inputUsername) {
      runQuery(`
        select *
        from users
        where password = '${inputPassword}' 
        and username = '${inputUsername}';
      `).then((result: any) => {
        const results = result._array;

        if (result.length > 0) {
          const user = results[0];
          this.props.logIn(user);
        } else {
          Alert.alert(
            'LookinnaBook',
            `Those credentials didn't seem to work, please verify your username and password`,
            [{
              text: 'Done',
              style: 'default'
            }], {
              cancelable: true
            }
          );
        }
      })
    } else {
      Alert.alert(
        'LookinnaBook',
        `Please enter valid credentials!`,
        [{
          text: 'Done',
          style: 'default',
        }], {
          cancelable: true,
        }
      );
    }
  }

  updateOrders = () => {
    const { currUser } = this.props.bookAppStore;
    
    runQuery(`
      select * 
      from orders 
      where user_ID = '${currUser.userId}'
    `).then((result: any) => {
      const results = result._array;
      this.setState({ orders: results });
    })
  }

  verifyUniquePublisher = async (targetID) => {
    return await runQuery(`
      select publisher_ID from publisher where publisher_ID = '${targetID}'
    `).then((res: any) => {
      if (res._array.length === 0) {
        return Promise.resolve(true)
      } else {
        return Promise.resolve(false)
      }
    })
  }

  createNewPublisher = async () => {
    const {
      inputPublisherId, 
      inputPublisherName,
      inputPublisherAddress,
      inputPublisherBankNumber,
      inputPublisherPhone 
    } = this.state;

    if (inputPublisherId &&
      inputPublisherName &&
      inputPublisherAddress &&
      inputPublisherBankNumber &&
      inputPublisherPhone && 
      inputPublisherPhone &&
      await this.verifyUniquePublisher(inputPublisherId)
    ) {
      runQuery(`
        insert into publisher (
          publisher_ID, name, bank_number, address, phone_num
        )
        values (
            '${inputPublisherId}', '${inputPublisherName}', ${inputPublisherBankNumber}, '${inputPublisherAddress}', '${inputPublisherPhone}'
        );
      `)
      this.setState({ showNewPublisher: false });
    } else {
      Alert.alert(
        'LookinnaBook',
        `Please verify your information and try again!`,
        [{
          text: 'Done',
          style: 'default',
        }], {
          cancelable: true,
        }
      );
    }
  }

  createNewAdmin = () => {
    const { newAdminSelection } = this.state;

    runQuery(`
      update users
      set role_ID = 'r-00'
      where username = '${newAdminSelection}';
    `).then((result: any) => {
      Alert.alert(
        'LookinnaBook',
        `${newAdminSelection} is now an admin!`,
        [{
          text: 'Done',
          style: 'default'
        }], {
          cancelable: true
        }
      );

      this.setState({ showNewAdmin: false, newAdminSelection: null });
    });
  }

  updateBillingInfo = () => {
    const { updateAddress, updateCardNumber, updateExpiryMonth, updateExpiryYear, updatePhoneNumber } = this.state;
    const { currUser } = this.props.bookAppStore;

    if (!(updateAddress && updateCardNumber && updateExpiryMonth && updateExpiryYear && updatePhoneNumber)) {
      Alert.alert(
        'LookinnaBook',
        `Please enter valid information!`,
        [{
          text: 'Done',
          style: 'default'
        }], {
          cancelable: true
        }
      );

      return; 
    }

    runQuery(`
      update users
      set address = '${updateAddress}', card_number = ${updateCardNumber}, phone_number = '${updatePhoneNumber}', month = ${updateExpiryMonth}, year = ${updateExpiryYear}
      where user_ID = '${currUser.userId}';
    `).then((result: any) => {
      
      // runQuery(`
      //   select * from users;
      // `).then((result) => console.log(result));

      this.props.updateUser({ updateAddress, updateCardNumber, updateExpiryMonth, updateExpiryYear, updatePhoneNumber })
    })
    this.setState({ showBilling: false })
  }

  trackOrder = () => {
    const { inputTrackOrder } = this.state;
  
    if (!inputTrackOrder) {
      Alert.alert(
        'LookinnaBook',
        `Please enter a valid tracking number!`,
        [{
          text: 'Done',
          style: 'default'
        }], {
          cancelable: true
        }
      );

      return;
    }

    runQuery(`
      select * 
      from orders
      where tracking_num = '${inputTrackOrder}';
    `).then((result: any) => {
      if (result._array.length > 0) {
        this.setState({ orderStatus: 'Your order will be delivered in 3 business days' })
      } else {
        Alert.alert(
          'LookinnaBook',
          `That order doesn't seem to exist!`,
          [{
            text: 'Done',
            style: 'default'
          }], {
            cancelable: true
          }
        );
      }
    })
  }

  getSales = () => {
    runQuery(salesPerGenre).then((result: any) => console.log(result));
    runQuery(salesPerAuthor).then((result: any) => console.log(result));

    
  }

  render() {
    const { currUser } = this.props.bookAppStore;
    const { showOrderHistory, 
      showBilling, 
      inputPassword, 
      inputUsername, 
      orders, 
      showNewPublisher, 
      inputPublisherId, 
      inputPublisherName,
      inputPublisherAddress,
      inputPublisherBankNumber,
      inputPublisherPhone,
      inputTrackOrder,
      showNewAdmin,
      availableUsers,
      newAdminSelection,
      updateExpiryMonth,
      updateExpiryYear,
      updateCardNumber,
      updateAddress,
      updatePhoneNumber,
      showDeleteUser,
      showTracking,
      showSales,
      deleteUserSelection,
      orderStatus
    } = this.state;

    return (
      <View style={AccountStyles.accountContainer}>
        {currUser !== null && (
          <View>
            <Modal
              onShow={() => this.getSales()}
              animationType='fade'
              transparent={true}
              visible={showSales}
            >
              <View style={generalStyles.overlayContainer}>
                <View style={generalStyles.contentOverlayContainer}>
                  <Text style={[generalStyles.cardHeader]}>
                    Sales report
                  </Text>
                  <ScrollView style={AccountStyles.orderHistoryContainer}>
                    <Text>
                      Sales go here
                    </Text>
                  </ScrollView>
                  <TouchableOpacity 
                    style={generalStyles.closeOverlayButton} 
                    onPress={() => this.setState({ showSales: false })}
                  >
                    <Text style={[generalStyles.actionExit, { color: colors.blue }]}>
                      done
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            <Modal
              onShow={() => this.updateOrders()}
              animationType='fade'
              transparent={true}
              visible={showOrderHistory}
            >
              <View style={generalStyles.overlayContainer}>
                <View style={generalStyles.contentOverlayContainer}>
                  <Text style={[generalStyles.cardHeader]}>
                    Your order history
                  </Text>
                  <ScrollView style={AccountStyles.orderHistoryContainer}>
                    {(orders.length > 0) ? (
                      orders.map((order, index) => (
                        <View style={AccountStyles.orderContainer} key={index}>
                          <View style={AccountStyles.orderDescriptionContainer}>
                            <Text style={[generalStyles.header1Bold]}>
                              {`tracking #${order.tracking_num}`}
                            </Text>
                            <Text style={[generalStyles.header1Bold, { textAlign: 'right' }]}>
                              {`$${order.price}`}
                            </Text>
                          </View>
                          <View style={AccountStyles.orderDescriptionContainer}>
                            <Text style={[generalStyles.header2]}>
                              {`${order.day}/${order.month}/${order.year}`}
                            </Text>
                          </View>
                        </View>
                      ))
                    ) : (
                      <Text style={generalStyles.header2}>
                        You haven't placed any orders yet!
                      </Text>
                    )}
                  </ScrollView>
                  <TouchableOpacity 
                    style={generalStyles.closeOverlayButton} 
                    onPress={() => this.setState({ showOrderHistory: false })}
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
              visible={showNewPublisher}
            >
              <View style={generalStyles.overlayContainer}>
                <View style={generalStyles.contentOverlayContainer}>
                  <ScrollView style={AccountStyles.orderHistoryContainer}>
                    <Text style={[generalStyles.cardHeader]}>
                      Add a new publisher
                    </Text>
                    <View style={AccountStyles.billingInfoContainer}>
                      <Text style={[generalStyles.subheader1, { marginTop: 10 }]}>
                        Name
                      </Text>
                      <TextInput
                        style={[generalStyles.header1, AccountStyles.billingInfoInputBox]} 
                        onChangeText={(input) => this.setState({ inputPublisherName: input })}
                        value={inputPublisherName}
                      />

                      <Text style={[generalStyles.subheader1, { marginTop: 10 }]}>
                        id
                      </Text>
                      <TextInput 
                        style={[generalStyles.header1, AccountStyles.billingInfoInputBox]}
                        onChangeText={(input) => this.setState({ inputPublisherId: input })}
                        value={inputPublisherId}
                      />

                      <Text style={[generalStyles.subheader1, { marginTop: 10 }]}>
                        Bank account
                      </Text>
                      <TextInput 
                        style={[generalStyles.header1, AccountStyles.billingInfoInputBox]}
                        onChangeText={(input) => this.setState({ inputPublisherBankNumber: input })}
                        value={inputPublisherBankNumber}
                        keyboardType='number-pad'
                      />

                      <Text style={[generalStyles.subheader1, { marginTop: 10 }]}>
                        Address
                      </Text>
                      <TextInput 
                        style={[generalStyles.header1, AccountStyles.billingInfoInputBox]}
                        onChangeText={(input) => this.setState({ inputPublisherAddress: input })}
                        value={inputPublisherAddress}
                      />

                      <Text style={[generalStyles.subheader1, { marginTop: 10 }]}>
                        Phone number
                      </Text>
                      <TextInput 
                        style={[generalStyles.header1, AccountStyles.billingInfoInputBox]}
                        onChangeText={(input) => this.setState({ inputPublisherPhone: input })}
                        value={inputPublisherPhone}
                        keyboardType='phone-pad'
                      />
                    </View>
                  </ScrollView>
                  <TouchableOpacity
                    style={generalStyles.closeOverlayButton} 
                    onPress={() => this.createNewPublisher()}
                  >
                    <Text style={[generalStyles.actionExit, { color: colors.blue }]}>
                      save
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={generalStyles.exitOverlayButton} 
                    onPress={() => this.setState({ showNewPublisher: false })}
                  >
                    <Text style={[generalStyles.actionExit, { color: colors.blue }]}>
                      close
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            <Modal 
              animationType='fade'
              transparent={true}
              visible={showTracking}
            >
              <View style={generalStyles.overlayContainer}>
                <View style={generalStyles.contentOverlayContainer}>
                  <Text style={[generalStyles.cardHeader]}>
                    Track an order
                  </Text>
                  <View style={AccountStyles.billingInfoContainer}>
                    <Text style={[generalStyles.subheader1, { marginTop: 10, marginBottom: 4 }]}>
                      Enter your tracking number here
                    </Text>
                    <TextInput
                      style={[generalStyles.header1, AccountStyles.billingInfoInputBox]} 
                      onChangeText={(input) => this.setState({ inputTrackOrder: input })}
                      placeholder="i.e. o-12345"
                      value={inputTrackOrder}
                    />
                  <Text style={[generalStyles.header1Bold, { marginTop: 20 }]}>
                    {orderStatus}
                  </Text>
                  </View>
                  <TouchableOpacity
                    style={generalStyles.closeOverlayButton} 
                    onPress={() => this.trackOrder()}
                  >
                    <Text style={[generalStyles.actionExit, { color: colors.blue }]}>
                      track order
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={generalStyles.exitOverlayButton} 
                    onPress={() => this.setState({ showTracking: false })}
                  >
                    <Text style={[generalStyles.actionExit, { color: colors.blue }]}>
                      close
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            <Modal 
              animationType='fade'
              transparent={true}
              visible={showNewAdmin}
              onShow={() => {
                runQuery(`
                  select username 
                  from users
                  where role_ID not in ('r-00');
                `).then((result: any) => {
                  const users = result._array.reduce((acc: any [], user) => {
                    acc.push(user.username);
                    return acc;
                  }, []);

                  if (users.length === 1) {
                    this.setState({ availableUsers: users, newAdminSelection: users[0] });
                  } else {
                    this.setState({ availableUsers: users });
                  }
                })
              }}
            >
              <View style={generalStyles.overlayContainer}>
                <View style={generalStyles.contentOverlayContainer}>
                  <View>
                    <Text style={[generalStyles.cardHeader]}>
                      Make a user an admin 
                    </Text>
                    <Text style={[generalStyles.subheader2]}>
                      Select a username from the dropdown
                    </Text>
                  </View>
                  {availableUsers.length > 0 ? (
                    <Picker 
                      onValueChange={(value) => this.setState({ newAdminSelection: value })}
                      selectedValue={newAdminSelection}
                      style={{ width: '100%', marginTop: 20, marginBottom: 20, alignItems: 'center' }}>
                      {availableUsers.map((username, index) => (
                        <Picker.Item key={index} label={username} value={username} />
                      ))}
                    </Picker>
                  ) : (
                    <View style={{ marginTop: 20, marginBottom: 20 }}>
                      <Text style={[generalStyles.subheader1]}>
                        There are no available users!
                      </Text>
                    </View>
                  )}
                  <TouchableOpacity
                    style={generalStyles.closeOverlayButton} 
                    onPress={() => this.createNewAdmin()}
                  >
                    <Text style={[generalStyles.actionExit, { color: colors.blue }]}>
                      close & save
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={generalStyles.exitOverlayButton} 
                    onPress={() => this.setState({ showNewAdmin: false })}
                  >
                    <Text style={[generalStyles.actionExit, { color: colors.blue }]}>
                      close
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            <Modal 
              animationType='fade'
              transparent={true}
              visible={showDeleteUser}
              onShow={() => {
                runQuery(`
                  select username 
                  from users
                  where role_ID not in ('r-00');
                `).then((result: any) => {
                  const users = result._array.reduce((acc: any [], user) => {
                    acc.push(user.username);
                    return acc;
                  }, []);

                  if (users.length === 1) {
                    this.setState({ availableUsers: users, deleteUserSelection: users[0] });
                  } else {
                    this.setState({ availableUsers: users });
                  }
                })
              }}
            >
              <View style={generalStyles.overlayContainer}>
                <View style={generalStyles.contentOverlayContainer}>
                  <View>
                    <Text style={[generalStyles.cardHeader]}>
                      Delete a user account from the store 
                    </Text>
                    <Text style={[generalStyles.subheader2]}>
                      Select a username from the dropdown
                    </Text>
                  </View>
                  {availableUsers.length > 0 ? (
                    <Picker 
                      onValueChange={(value) => this.setState({ deleteUserSelection: value })}
                      selectedValue={deleteUserSelection}
                      style={{ width: '100%', marginTop: 20, marginBottom: 20, alignItems: 'center' }}>
                      {availableUsers.map((username, index) => (
                        <Picker.Item key={index} label={username} value={username} />
                      ))}
                    </Picker>
                  ) : (
                    <View style={{ marginTop: 20, marginBottom: 20 }}>
                      <Text style={[generalStyles.subheader1]}>
                        There are no available users!
                      </Text>
                    </View>
                  )}
                  <TouchableOpacity
                    style={generalStyles.closeOverlayButton} 
                    onPress={() => this.deleteAccount()}
                  >
                    <Text style={[generalStyles.actionExit, { color: colors.blue }]}>
                      close & save
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={generalStyles.exitOverlayButton} 
                    onPress={() => this.setState({ showDeleteUser: false })}
                  >
                    <Text style={[generalStyles.actionExit, { color: colors.blue }]}>
                      close
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            <Modal
              animationType='fade'
              transparent={true}
              visible={showBilling}
              onShow={() => this.setState({ 
                updateExpiryYear: currUser.expiryYear, 
                updateExpiryMonth: currUser.expiryMonth,
                updatePhoneNumber: currUser.phoneNumber,
                updateAddress: currUser.address,
                updateCardNumber: (currUser.cardNumber ? currUser.cardNumber.toString() : '')
              })}
            >
              <View style={generalStyles.overlayContainer}>
                <View style={generalStyles.contentOverlayContainer}>
                  <ScrollView style={AccountStyles.orderHistoryContainer}>
                    <Text style={[generalStyles.cardHeader]}>
                      Your billing information
                    </Text>
                    <View style={AccountStyles.billingInfoContainer}>
                      <Text style={[generalStyles.subheader1, { marginTop: 10 }]}>
                        Card number
                      </Text>
                      <TextInput 
                        style={[generalStyles.header1, AccountStyles.billingInfoInputBox]} 
                        placeholder={(currUser.cardNumber) ? currUser.cardNumber.toString() : ''}
                        onChangeText={(input) => this.setState({ updateCardNumber: input })}
                        value={updateCardNumber}
                      />

                      <Text style={[generalStyles.subheader1, { marginTop: 10 }]}>
                        Expiry date
                      </Text>
                      <Text style={[generalStyles.subheader1, { marginTop: 4 }]}>
                        Year
                      </Text>
                      <Picker
                        onValueChange={(value) => this.setState({ updateExpiryYear: value })}
                        selectedValue={updateExpiryYear}
                        style={{ width: '100%', alignItems: 'center' }}>
                        {['2020', '2021', '2022', '2023', '2024'].map((year, index) => (
                          <Picker.Item key={index} label={year} value={year} />
                        ))}
                      </Picker>
                      <Text style={[generalStyles.subheader1]}>
                        Month
                      </Text>
                      <Picker
                        onValueChange={(value) => this.setState({ updateExpiryMonth: value })}
                        selectedValue={updateExpiryMonth}
                        style={{ width: '100%', alignItems: 'center' }}>
                        {['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].map((year, index) => (
                          <Picker.Item key={index}label={year} value={year} />
                        ))}
                      </Picker>

                      <Text style={[generalStyles.subheader1, { marginTop: 0 }]}>
                        Address
                      </Text>
                      <TextInput 
                        style={[generalStyles.header1, AccountStyles.billingInfoInputBox]} 
                        placeholder={(currUser.address ? currUser.address : '')} 
                        onChangeText={(input) => this.setState({ updateAddress: input })}
                        value={updateAddress}
                      />

                      <Text style={[generalStyles.subheader1, { marginTop: 10 }]}>
                        Phone number
                      </Text>
                      <TextInput 
                        style={[generalStyles.header1, AccountStyles.billingInfoInputBox]} 
                        placeholder={(currUser.phoneNumber ? currUser.phoneNumber : '')} 
                        onChangeText={(input) => this.setState({ updatePhoneNumber: input })}
                        value={updatePhoneNumber}
                      />
                    </View>
                  </ScrollView>
                  <TouchableOpacity
                    style={generalStyles.closeOverlayButton} 
                    onPress={() => this.updateBillingInfo()}
                  >
                    <Text style={[generalStyles.actionExit, { color: colors.blue }]}>
                      close & save
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={generalStyles.exitOverlayButton} 
                    onPress={() => this.setState({ showBilling: false })}
                  >
                    <Text style={[generalStyles.actionExit, { color: colors.blue }]}>
                      close
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        )}

        <View style={AccountStyles.headerContainer}>
          <Header title="Account" />
        </View>
        {currUser === null ? (
          <View style={[AccountStyles.loginContainer]}>
            <TextInput 
              style={[generalStyles.header1, AccountStyles.loginInputBox]} 
              placeholder="username"
              value={inputUsername}
              onChangeText={(input) => this.setState({ inputUsername: input })}
              autoCapitalize="none"
            />
            <TextInput 
              secureTextEntry={true} 
              style={[generalStyles.header1, AccountStyles.loginInputBox]} 
              placeholder="password"
              value={inputPassword}
              onChangeText={(input) => this.setState({ inputPassword: input })}
            />
            <View style={{ width: '100%', marginTop: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity onPress={() => this.registerUser()} style={[AccountStyles.loginButton, { width: '47%', backgroundColor: 'white', borderColor: colors.blue, borderWidth: 2 }]}>
                <Text style={[generalStyles.actionButton, { color: colors.blue }]}>
                  register
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.userLogin()} style={[AccountStyles.loginButton, { width: '47%' }]}>
                <Text style={[generalStyles.actionButton]}>
                  log in
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={[AccountStyles.loginContainer]}>
            <Text style={[generalStyles.header2, { fontSize: 36, textAlign: 'center' }]}>
              {`Hello, ${currUser.username}\n`}
              <Text style={[generalStyles.subheader1]}>
                good to see you again
              </Text>
            </Text>
            <TouchableOpacity onPress={() => this.setState({ showOrderHistory: true })} style={{ marginTop: 30 }}>
              <Text style={[generalStyles.actionButton, { color: colors.blue }]}>
                order history
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.setState({ showBilling: true })} style={{ marginTop: 10 }}>
              <Text style={[generalStyles.actionButton, { color: colors.blue }]}>
                billing information 
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.setState({ showTracking: true })} style={{ marginTop: 10 }}>
              <Text style={[generalStyles.actionButton, { color: colors.blue }]}>
                track an order
              </Text>
            </TouchableOpacity>
            {currUser.admin && (
              <View style={{ justifyContent: 'center', width: '100%', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => this.setState({ showNewPublisher: true })} style={{ marginTop: 10 }}>
                  <Text style={[generalStyles.actionButton, { color: colors.blue }]}>
                    add a publisher
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.setState({ showNewAdmin: true })} style={{ marginTop: 10 }}>
                  <Text style={[generalStyles.actionButton, { color: colors.blue }]}>
                    new admin
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.setState({ showSales: true })} style={{ marginTop: 10 }}>
                  <Text style={[generalStyles.actionButton, { color: colors.blue }]}>
                    sales reports 
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.setState({ showDeleteUser: true })} style={{ marginTop: 10 }}>
                  <Text style={[generalStyles.actionButton, { color: colors.blue }]}>
                    delete a user
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            <TouchableOpacity onPress={() => {
              this.setState({ inputUsername: '', inputPassword: '' })
              this.props.logOut()
            }} style={AccountStyles.loginButton}>
              <Text style={[generalStyles.actionButton]}>
                log out 
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.deleteAccount(currUser.username)} style={{ marginTop: 10 }}>
              <Text style={[generalStyles.subheader1, { color: colors.red }]}>
                delete account 
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    logIn,
    logOut,
    updateUser
  }, dispatch)
);

const mapStateToProps = (state) => {
  const { bookAppStore } = state
  return { bookAppStore }
};

export default connect(mapStateToProps, mapDispatchToProps)(Account);