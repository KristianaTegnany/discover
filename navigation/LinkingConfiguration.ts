import * as Linking from 'expo-linking';

export default {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      Root: {
        screens: {
          Tables: {
            screens: {
              TablesScreen: 'Tables',
            },
          },
          Guides: {
            screens: {
              GuidesScreen: 'Guides',
            },
          },
       
        },
      },
      NotFound: '*',
    },
  },
};
