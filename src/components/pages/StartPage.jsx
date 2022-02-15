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
import currentGame from '../../boundaries/currentGame';
import db from '../../boundaries/db';

export default class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.onLoad = this.onLoad.bind(this);
    this.eraseDraft = this.eraseDraft.bind(this);
    this.useDraft = this.useDraft.bind(this);
    this.state = { drafts: [] };
  }

  componentDidMount() {
    db.drafts.toArray().then((drafts) => { this.setState({ drafts }); });
  }

  onLoad() {
    if (currentGame.isPresent()) {
      this.props.f7router.navigate('/games/current');
    }
  }

  eraseDraft(draftId) {
    return () => {
      this.$f7.dialog.confirm(
        'Tem certeza que deseja remover a turma? Não é possível desfazer essa ação.',
        'Apagar turma',
        () => {
          db.drafts.delete(draftId).then(() => {
            this.componentDidMount();
          })
        });
    }
  }

  useDraft(draft) {
    return () => {
      currentGame.generateFromDraft(draft);
      this.props.f7router.navigate('/games/current');
    }
  }

  render() {
    return <Page onPageAfterIn={this.onLoad}>
      <Navbar title="Detetive - Ficha de Palpites"></Navbar>
      <Block strong>
        <p>Bem-vindo à Ficha de Palpites. Você pode iniciar um novo jogo ou carregar uma configuração existente.</p>
      </Block>
      <BlockTitle>Minhas Turmas</BlockTitle>
      <Block>
        <List>
          <ListItem title="Criar novo jogo" link="/games/new"></ListItem>
          {
            this.state.drafts.length === 0 ?
              <ListItem disabled title="Nenhuma turma encontrada" /> :
              this.state.drafts.map((draft) => <ListItem key={draft.id} title={draft.name}>
                <Button fill raised style={{ marginLeft: '5px' }} onClick={this.eraseDraft(draft.id)} color="red" slot="after">Excluir</Button>
                <Button fill raised style={{ marginLeft: '5px' }} onClick={this.useDraft(draft)} slot="after">Jogar</Button>
              </ListItem>)
          }
        </List>
      </Block>
    </Page>
  }
}
