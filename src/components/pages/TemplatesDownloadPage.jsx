import React, { Component } from 'react';
import {
  Block,
  BlockTitle,
  Button,
  List,
  ListItem,
  Navbar,
  Page,
} from 'framework7-react';
import templates from '../../templates'
import db from '../../boundaries/db';

export default class TemplatesDownloadPage extends Component {
  constructor(props) {
    super(props);
    this.state = { templates: [], downloadedTemplates: {} };
    this.downloadTemplate = this.downloadTemplate.bind(this);
  }

  componentDidMount() {
    db.templates.toArray().then((localTemplates) => {
      this.setState({
        templates,
        downloadedTemplates: localTemplates.reduce((memo, template) => (
         { ...memo, [template.id]: template.version }
        ), {}),
      });
    });
  }

  downloadTemplate(template) {
    return () => {
      db.templates.put(template).then(() => {
        const downloadedTemplates = {};
        db.templates.toArray().then(templates => {
          templates.forEach(template => {
            downloadedTemplates[template.id] = template.version;
          });

          this.setState({ downloadedTemplates });
        });
      });
    }
  }

  render() {
    return <Page>
      <Navbar backLink="Voltar" backLinkForce={true} title="Carregar Templates"></Navbar>
      <BlockTitle>Templates disponíveis</BlockTitle>
      <Block>
        <List>
          { this.state.templates.map(game => <ListItem key={game.id} title={game.name}>
            <img slot="media" alt={game.name} src={game.imageUrl} width="44" />
            { !this.state.downloadedTemplates[game.id] ?
                <Button slot="after" onClick={this.downloadTemplate(game)}>CARREGAR</Button> :
                this.state.downloadedTemplates[game.id] === game.version ?
                  <Button slot="after" disabled={true}>CARREGADO</Button> :
                  <Button slot="after" color="green" onClick={this.downloadTemplate(game, this.setState)}>ATUALIZAR</Button>
              }
          </ListItem>) }
        </List>
      </Block>
    </Page>
  }
}
