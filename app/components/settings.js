import React, { Component } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

// 3rd party libraries
import { Actions } from 'react-native-router-flux';
import { Cell, Section, TableView } from 'react-native-tableview-simple';
import DeviceInfo from 'react-native-device-info';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NavigationBar from 'react-native-navbar';
import store from 'react-native-simple-store';

import commonStyle from '../utils/common-styles';
import I18n from '../utils/i18n';

const styles = StyleSheet.create(Object.assign({}, commonStyle, {
  container: {
    flex: 1,
    backgroundColor: '#EFEFF4',
    marginBottom: 50,
  },
  form: {
    backgroundColor: '#EFEFF4',
  },
}));

export default class SettingsView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      UniqueID: '',
    };
  }

  componentDidMount() {
    const that = this;
    store.get('UniqueID')
    .then((UniqueID) => {
      that.setState({ UniqueID });
    });
  }

  renderToolbar() {
    if (Platform.OS === 'ios') {
      return (
        <NavigationBar
          statusBar={{ tintColor: 'white', style: 'default' }}
          style={styles.navigatorBarIOS}
          title={{ title: this.props.title, tintColor: '#4A4A4A' }}
        />
      );
    } else if (Platform.OS === 'android') {
      return (
        <Icon.ToolbarAndroid
          style={styles.toolbar}
          title={this.props.title}
          titleColor="#4A4A4A"
        />
      );
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderToolbar()}

        <ScrollView>
          <TableView>
            <Section>
              <Cell
                cellStyle="RightDetail"
                title={I18n.t('version')}
                detail={`${DeviceInfo.getReadableVersion()}`}
              />
            </Section>

            <Section>
              <Cell
                cellStyle="Basic"
                title={I18n.t('intro')}
                onPress={() => Actions.settingsIntro()}
              />
              <Cell
                cellStyle="Basic"
                title={I18n.t('feedback')}
                onPress={() => Actions.settingsFeedback()}
              />
            </Section>

            <Section>
              <Cell
                cellStyle="Basic"
                title={I18n.t('login')}
                onPress={() => Actions.settingsLogin()}
              />
            </Section>
          </TableView>
        </ScrollView>
      </View>
    );
  }
}

SettingsView.propTypes = {
  title: React.PropTypes.string,
};

SettingsView.defaultProps = {
  title: '',
};
