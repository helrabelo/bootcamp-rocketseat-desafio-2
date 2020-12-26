const express = require('express');
const cors = require('cors');
// const { uuid, validate } = require('uuid');

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

const validateProjectID = (request, response, next) => {
  const { id } = request.params;

  if (!isUuid(id)) response.status(400).json({ error: 'Invalid project ID' });

  console.log('id was valid');

  return next();
};

app.use('/repositories/:id/', validateProjectID);
app.use('/repositories/:id/:like', validateProjectID);

app.get('/repositories', (request, response) => {
  return response.json(repositories);
});

app.post('/repositories', (request, response) => {
  const { title, url, techs } = request.body;

  const project = {
    id: uuid(),
    title: title,
    url: url,
    techs: techs,
    likes: 0,
  };

  repositories.push(project);

  return response.json(project);
});

app.get('/repositories/:id', (request, response) => {
  const { id } = request.params;

  const projectIndex = repositories.findIndex((project) => project.id === id);

  return response.json(repositories[projectIndex]);
});

app.put('/repositories/:id', (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const projectIndex = repositories.findIndex((project) => project.id === id);

  if (projectIndex < 0)
    response.status(400).json({ error: 'Project not found' });

  const project = {
    ...repositories[projectIndex],
    title: title,
    url: url,
    techs: techs,
  };

  repositories[projectIndex] = project;

  return response.json(repositories[projectIndex]);
});

app.delete('/repositories/:id', (request, response) => {
  const { id } = request.params;

  const projectIndex = repositories.findIndex((project) => project.id === id);

  if (projectIndex < 0) return response.status(400).json({ error: 'Project not found' });

  repositories.splice(projectIndex, 1);

  return response.status(204).send();
});

app.post('/repositories/:id/like', (request, response) => {
  const { id } = request.params;

  const projectIndex = repositories.findIndex((project) => project.id === id);

  if (projectIndex < 0)
    response.status(400).json({ error: 'Project not found' });

  repositories[projectIndex] = {
    ...repositories[projectIndex],
    likes: repositories[projectIndex].likes + 1,
  };

  return response.json(repositories[projectIndex]);
});

module.exports = app;
