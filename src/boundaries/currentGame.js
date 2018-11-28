import Cryptr from 'cryptr';
import config from '../environment/config';

const encryptor = new Cryptr(config.GAMESTATE_SECRET);

export default {
  save(object) {
    localStorage.setItem('_currentGame', encryptor.encrypt(JSON.stringify(object)));
  },

  fetch() {
    try {
      return JSON.parse(encryptor.decrypt(localStorage.getItem('_currentGame')));
    } catch {
      return undefined;
    }  
  },

  isPresent() {
    return !!localStorage.getItem('_currentGame');
  },

  destroy() {
    return localStorage.removeItem('_currentGame');
  },

  toEmpty() {
    const filledGame = this.fetch();
    return JSON.stringify({
      characters: filledGame.characters.map((char) => { return { name: char.name, owners: [], flags: [] } }),
      weapons: filledGame.weapons.map((weapon) => { return { name: weapon.name, owners: [], flags: [] } }),
      places: filledGame.places.map((place) => { return { name: place.name, owners: [], flags: [] } }),
      players: filledGame.players
    });
  },

  generateFromDraft(draft) {
    this.save({
      template: draft.id,
      characters: draft.template.bundle.characters.map((char) => { return { name: char, owners: [], flags: [] } }),
      weapons: draft.template.bundle.weapons.map((weapon) => { return { name: weapon, owners: [], flags: [] } }),
      places: draft.template.bundle.places.map((place) => { return { name: place, owners: [], flags: [] } }),
      players: draft.players.filter((player) => !!player)
    });
  }
}
