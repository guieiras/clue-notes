import React, { Component } from 'react';
import {
  BlockTitle,
  Button,
  Chip,
  Link,
  List,
  ListItem,
  Navbar,
  NavRight,
  Page,
  f7
} from 'framework7-react';
import currentGame from '../../boundaries/currentGame';

export default class GamesCurrentPage extends Component {
  constructor(props) {
    super(props);
    this.removeItem = this.removeItem.bind(this);
    this.selectItem = this.selectItem.bind(this);
    this.exitGame = this.exitGame.bind(this);
    this.container = React.createRef();
    this.state = { game: currentGame.fetch() };
  }

  exitGame() {
    this.$f7.dialog.confirm(
      'A ficha atual será apagada. Não é possível desfazer essa ação.',
      'Deseja sair?',
      () => {
        currentGame.destroy();
        this.props.f7router.navigate('/');
      })
  }

  selectItem(item, idx) {
    return () => {
      this.sheet = f7.actions.create({
        grid: true,
        buttons: [this.state.game.players.map((player) => {
          return {
            text: player,
            icon: `<span style="width: 48px;
                                height: 48px;
                                line-height: 47px;
                                vertical-align: middle;
                                font-size: 26px;"
                          class="badge color-gray">
                            ${player.substring(0, 1)}
                    </span>`,
            onClick: this.pushItem(item, idx, 'owners', player).bind(this)
          }
        }), [
          {
            text: 'Confidencial',
            icon: '<i class="color-green icon material-icons" style="font-size: 48px">fingerprint</i>',
            onClick: this.pushItem(item, idx, 'flags', { icon: 'fingerprint', color: 'green' }).bind(this)
          },
          {
            text: 'Dúvida',
            icon: '<i class="color-yellow icon material-icons" style="color: $green; font-size: 48px">visibility</i>',
            onClick: this.pushItem(item, idx, 'flags', { icon: 'visibility', color: 'yellow' }).bind(this)
          },
          {
            text: 'Atenção',
            icon: '<i class="color-red icon material-icons" style="font-size: 48px">warning</i>',
            onClick: this.pushItem(item, idx, 'flags', { icon: 'warning', color: 'red' }).bind(this)
          },
        ]]
      });
      this.sheet.on('close', () => { this.sheet.destroy() });
      this.sheet.open();
    }
  }

  pushItem(item, itemIdx, type, value) {
    return () => {
      const { game } = this.state;
      game[item][itemIdx][type].push(value);
      currentGame.save(game);
      this.setState({ game });
    }
  }

  removeItem(item, itemIdx, type, positionIdx) {
    return () => {
      const { game } = this.state;
      game[item][itemIdx][type].splice(positionIdx, 1);
      currentGame.save(game);
      this.setState({ game });
    }
  }

  render() {
    const cardTypeTranslation = { characters: 'Suspeitos', weapons: 'Armas', places: 'Lugares' }
    return <Page>
      <Navbar title="Ficha de Suspeitos">
        <NavRight>
          <Button iconMaterial="exit_to_app" onClick={this.exitGame} />
        </NavRight>
      </Navbar>
      {
        Object.keys(cardTypeTranslation).map((key) => <div key={key}>
          <BlockTitle>{cardTypeTranslation[key]}</BlockTitle>
          <List>
            { this.state.game[key].map((char, idx) => <ListItem key={idx} title={char.name}>
              <div slot="after">
                { char.flags.map((flag, flagIdx) => <Link iconMaterial={flag.icon} key={flagIdx} color={flag.color} onClick={this.removeItem(key, idx, 'flags', flagIdx)} />) }
              </div>
              <div slot="after">
                { char.owners.map((owner, ownerIdx) => <Chip key={ownerIdx} text={owner} deleteable onClick={ this.removeItem(key, idx, 'owners', ownerIdx) } />) }
              </div>
              <Button slot="after" onClick={this.selectItem(key, idx)} iconMaterial="flag" />
            </ListItem>) }
          </List>
        </div>)
      }
    </Page>
  }
}
