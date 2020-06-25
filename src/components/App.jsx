import React from 'react';
import { App, View } from 'framework7-react';

import routes from '../routes';

export default function (props) {

  // Framework7 parameters here
  const f7params = {
    id: 'com.guieiras.cluenotes',
    name: 'Clue Notes',
    theme: 'auto',
    routes,
    dialog: {
      buttonOk: 'OK',
      buttonCancel: 'Cancelar'
    }
  };

  return (
    <App params={f7params}>
      <View id="main-view" url="/" main className="ios-edges"/>
    </App>
  );
};
