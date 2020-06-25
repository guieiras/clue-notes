import React, { Component } from 'react';
import {
  Block,
  BlockTitle,
  List,
  ListItem,
  Navbar,
  Page,
} from 'framework7-react';
import db from '../../boundaries/db';

export default class GamesNewPage extends Component {
  constructor(props) {
    super(props);
    this.state = { templates: [] };
  }

  componentDidMount() {
    db.templates.toArray().then((templates) => {
      this.setState({ templates });
    });
  }

  render() {
    return <Page>
      <Navbar backLink="Voltar" title="Novo Jogo"></Navbar>
      <BlockTitle>Selecione o modelo do jogo</BlockTitle>
      <Block>
        <List>
          { this.state.templates.map(game => <ListItem key={game.id} title={game.name} link={`/templates/${game.id}/new`}>
            <img slot="media" alt={game.title} src={game.imageUrl} width="44" />
          </ListItem>) }
          <ListItem link="/templates/download" title="Carregar templates" />
        </List>
      </Block>
    </Page>
  }
}
