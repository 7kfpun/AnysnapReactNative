import React, { Component } from 'react';

// 3rd party libraries
import { Actions } from 'react-native-router-flux';
import AppIntro from 'react-native-app-intro';  // eslint-disable-line import/no-named-as-default,import/no-named-as-default-member
import store from 'react-native-simple-store';

export default class IntroView extends Component {
  onSkipBtnHandle(index) {
    console.log(index);
    Actions.pop();
    store.delete('isIntroDone');
    // store.save('isIntroDone', true);
  }

  onSlideChangeHandle(index, total) {
    console.log(index, total);
  }

  doneBtnHandle() {
    Actions.pop();
    store.delete('isIntroDone');
    // store.save('isIntroDone', true);
  }

  nextBtnHandle(index) {
    console.log(index);
  }

  render() {
    const pageArray = [{
      title: 'SCAN THE BOOK COVER',
      description: '',
      backgroundColor: 'white',
      fontColor: '#606060',
      level: 10,
    }, {
      title: 'SCAN BARCODE & QR CODE',
      description: '',
      backgroundColor: 'white',
      fontColor: '#606060',
      level: 10,
    }, {
      title: 'IMAGE SEARCH',
      description: '',
      backgroundColor: 'white',
      fontColor: '#606060',
      level: 10,
    }];
    return (
      <AppIntro
        dotColor="#CEEEFA"
        activeDotColor="#40B1EC"
        rightTextColor="#15B4F1"
        leftTextColor="black"
        onNextBtnClick={this.nextBtnHandle}
        onDoneBtnClick={this.doneBtnHandle}
        onSkipBtnClick={this.onSkipBtnHandle}
        onSlideChange={this.onSlideChangeHandle}
        pageArray={pageArray}
      />
    );
  }
}
