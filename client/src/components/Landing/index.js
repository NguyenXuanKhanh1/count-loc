import React, { useState } from 'react';
import { Grid, Card, Header, Button, Form } from 'semantic-ui-react';
import LocChart from './locChart';
const axios = require('axios');
const host = `${window.location.href}analyzer`;
let errorMessage = null;
let loading = null;

const getAnalysis = async repoInfo => {
  const repo = repoInfo.repo.split('://');
  const url = host + `?repo=${repo[0]}://docker:${repoInfo.token}@${repo[1]}`;
  loading = true;
  repoInfo.setData([]);
  try {
    const response = await axios.get(url, { timeout: 50000 });
    loading = null;
    repoInfo.setData(response.data);
  } catch (error) {
    errorMessage = 'Not Found.';
    loading = null;
    repoInfo.setData([]);
  } finally {
    loading = null;
  }
};

const GitRepositoryForm = ({ setData }) => {
  const [repo, setRepo] = useState('');
  const gitAccessToken = '';
  const onSubmit = () =>
    getAnalysis({
      repo: repo,
      token: gitAccessToken,
      setData: setData
    });
  const onChange = event => setRepo(event.target.value);
  return (
    <Form onSubmit={onSubmit} loading={loading}>
      <Form.Field>
        <label>Git repository: </label>
        <input
          name='repo'
          value={repo}
          onChange={onChange}
          type='text'
          placeholder='git repository here: https://...'
        />
        <label>Access token: </label>
        <input
          name='token'
          value={gitAccessToken}
          onChange={onChange}
          type='text'
          placeholder='git access token here ...'
          disabled
        />
      </Form.Field>
      <Button primary type='submit'>
        Analysis
      </Button>
    </Form>
  );
};
const Landing = () => {
  const [data, setData] = useState(null);
  return (
    <div>
      <Header as='h2'>git repository information</Header>
      <Grid columns={1}>
        <Grid.Column>
          <Card fluid={true}>
            <Card.Content>
              <Card.Description>
                <GitRepositoryForm setData={setData} />
              </Card.Description>
            </Card.Content>
          </Card>
        </Grid.Column>
      </Grid>
      {errorMessage && <div style={{ color: 'red' }}> {errorMessage} </div>}
      {data && <LocChart data={data} />}
    </div>
  );
};

export default Landing;
