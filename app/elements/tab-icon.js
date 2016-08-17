import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

// 3rd party libraries
import Icon from 'react-native-vector-icons/Ionicons';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});

const TabIcon = function TabIcon(props) {
  return (
    <View style={styles.container}>
      <Icon name={props.iconName} color={props.selected ? 'red' : 'black'} size={26} />
      <Text style={{ color: props.selected ? 'red' : 'black' }}>{props.title}</Text>
    </View>
  );
};

TabIcon.propTypes = {
  selected: React.PropTypes.bool,
  title: React.PropTypes.string,
  iconName: React.PropTypes.string,
};

TabIcon.defaultProps = {
  selected: false,
};

export default TabIcon;
