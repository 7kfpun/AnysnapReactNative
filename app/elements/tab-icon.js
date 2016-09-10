import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

// 3rd party libraries
import Icon from 'react-native-vector-icons/MaterialIcons';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  text: {
    fontSize: 11,
  },
});

const TabIcon = function TabIcon(props) {
  return (
    <View style={styles.container}>
      <Icon
        style={{
          marginBottom: props.iconName === 'add-a-photo' ? 5 : 0,
        }}
        name={props.iconName}
        color={props.selected ? 'black' : 'white'}
        size={props.iconName === 'add-a-photo' ? 38 : 24}
      />
      {/* <Text style={[styles.text, { color: props.selected ? 'black' : 'white' }]}>{props.title}</Text> */}
    </View>
  );
};

TabIcon.propTypes = {
  selected: React.PropTypes.bool,
  // title: React.PropTypes.string,
  iconName: React.PropTypes.string,
};

TabIcon.defaultProps = {
  selected: false,
};

export default TabIcon;
