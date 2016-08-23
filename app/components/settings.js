import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
} from 'react-native';

// 3rd party libraries
import { Cell, Section, TableView } from 'react-native-tableview-simple';
import DeviceInfo from 'react-native-device-info';

import I18n from '../utils/i18n';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    marginTop: 60,
    marginBottom: 50,
  },
});

export default class Anysnap extends Component {
  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <TableView>
            <Section>
              <Cell
                cellStyle="RightDetail"
                title={I18n.t('settings')}
                detail={`${DeviceInfo.getVersion()} (${DeviceInfo.getBuildNumber()})`}
              />
            </Section>

          </TableView>
        </ScrollView>
      </View>
    );
  }
}
