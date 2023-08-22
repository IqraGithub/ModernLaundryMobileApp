import React from 'react';
import { Text, StyleSheet } from 'react-native';

const MAX_NOTE_LENGTH = 20; // Maximum number of characters for the note

const TruncatedText = ({ text }) => {
  if (text.length <= MAX_NOTE_LENGTH) {
    return <Text>{text}</Text>;
  }

  const truncatedText = text.slice(0, MAX_NOTE_LENGTH) + '...';

  return <Text>{truncatedText}</Text>;
};

const styles = StyleSheet.create({
  truncatedText: {
    fontSize: 14,
    color: 'black',
  },
});

export default TruncatedText;

// import React, { useState } from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import Tooltip from 'react-native-tooltip';

// const MAX_NOTE_LENGTH = 20; // Maximum number of characters for the note

// const TruncatedText = ({ text }) => {
//   const [showTooltip, setShowTooltip] = useState(false);

//   if (text.length <= MAX_NOTE_LENGTH) {
//     return <Text>{text}</Text>;
//   }

//   const truncatedText = text.slice(0, MAX_NOTE_LENGTH) + '...';

//   return (
//     <Tooltip
//       isVisible={showTooltip}
//       content={<Text style={styles.tooltipText}>{text}</Text>}
//       placement="top"
//       onClose={() => setShowTooltip(false)}>
//       <Text
//         style={styles.truncatedText}
//         onPress={() => setShowTooltip(true)}>
//         {truncatedText}
//       </Text>
//     </Tooltip>
//   );
// };

// const styles = StyleSheet.create({
//   truncatedText: {
//     fontSize: 14,
//     color: 'black',
//   },
//   tooltipText: {
//     fontSize: 14,
//     color: 'black',
//     padding: 10,
//   },
// });

// export default TruncatedText;
