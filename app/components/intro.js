import React, { Component } from 'react';

// 3rd party libraries
import AppIntro from 'react-native-app-intro';  // eslint-disable-line import/no-named-as-default,import/no-named-as-default-member
import { Actions } from 'react-native-router-flux';

export default class IntroView extends Component {
  onSkipBtnHandle(index) {
    console.log(index);
    Actions.pop();
  }

  onSlideChangeHandle(index, total) {
    console.log(index, total);
  }

  doneBtnHandle() {
    Actions.pop();
  }

  nextBtnHandle(index) {
    console.log(index);
  }

  render() {
    const pageArray = [{
      title: 'Page 1',
      description: 'Description 1',
      img: 'https://goo.gl/Bnc3XP',
      imgStyle: {
        height: 80 * 2.5,
        width: 109 * 2.5,
      },
      backgroundColor: '#fa931d',
      fontColor: '#fff',
      level: 10,
    }, {
      title: 'Page 2',
      description: 'Description 2',
      img: 'https://goo.gl/GPO6JB',
      imgStyle: {
        height: 93 * 2.5,
        width: 103 * 2.5,
      },
      backgroundColor: '#a4b602',
      fontColor: '#fff',
      level: 10,
    }];
    return (
      <AppIntro
        onNextBtnClick={this.nextBtnHandle}
        onDoneBtnClick={this.doneBtnHandle}
        onSkipBtnClick={this.onSkipBtnHandle}
        onSlideChange={this.onSlideChangeHandle}
        pageArray={pageArray}
      />
    );
  }
}
