import React, { Component } from 'react';
import {
  Block,
  Button,
  List,
  ListInput,
  Navbar,
  Page,
  ListItem,
} from 'framework7-react';
import db from '../../boundaries/db';
import currentGame from '../../boundaries/currentGame';

export default class DraftsNewPage extends Component {
  constructor(props) {
    super(props);
    this.state = { name: '', template: null, players: [] };
    this.handleInput = this.handleInput.bind(this);
    this.handleName = this.handleName.bind(this);
    this.createDraft = this.createDraft.bind(this);
  }

  componentDidMount() {
    const templateId = this.props.f7route.params.id;
    db.templates.get(templateId).then((template) => {
      this.setState({ template });
    });
  }

  createDraft() {
    const { name, template, players } = this.state;
    const draft = { name, template, players };
    const promise = name ? db.drafts.put(draft) : Promise.resolve();

    promise.then(() => {
      currentGame.generateFromDraft(draft);
      this.props.f7router.navigate('/games/current');
    });
  }

  handleInput(index) {
    return (ev) => {
      const players = this.state.players;

      players[index] = ev.target.value;
      this.setState({ players });
    }
  }

  handleName(event) {
    this.setState({ name: event.target.value });
  }

  render() {
    return <Page>
      <Navbar backLink="Voltar" title="Novo Jogo"></Navbar>
      <List inlineLabels>
        <ListInput label="Turma" placeholder="Nome da turma" type="text" onChange={this.handleName} />
        <ListItem header="Tipo de jogo" title={this.state.template && this.state.template.name } />
      </List>

      <List inlineLabels>
        {this.state.template && this.state.template.bundle.characters.map((_, index) =>
          <ListInput key={index} label={`Jogador ${index + 1}`} type="text" onChange={this.handleInput(index)} />
        )}
      </List>
      <Block>
        <Button big fill text={`${this.state.name ? 'Salvar turma e Iniciar' : 'Iniciar'}`} onClick={this.createDraft}></Button>
      </Block>
    </Page>
  }
}
