import React from 'react';

// 3rd party libraries
import { Actions } from 'react-native-router-flux';

export default class CameraTabView extends Component {
  componentDidMount() {
    Actions.pop();
  }

  render() {
    return null;
  }
}
