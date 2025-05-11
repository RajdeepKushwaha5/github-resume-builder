const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// Set EJS as view engine
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send(`
    <h2>GitHub Resume Builder</h2>
    <form method="get" action="/resume">
      <label for="username">GitHub Username:</label>
      <input type="text" name="username" required />
      <button type="submit">Generate Resume</button>
    </form>
  `);
});

app.get('/resume', async (req, res) => {
  const username = req.query.username;

  try {
    const response = await axios.get(`https://api.github.com/users/${username}/repos`);
    const repos = response.data;

    const projects = repos.map(repo => ({
      name: repo.name,
      description: repo.description,
      language: repo.language,
      url: repo.html_url
    }));

    res.render('resume', { username, projects });
  } catch (error) {
    res.send('Error fetching data. Check the username.');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
