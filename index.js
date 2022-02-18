  const fs = require('fs');
  const carbone = require('carbone');
  const path = require(`path`);

  const util = require(`util`);

  const express = require(`express`);
  const bodyParser = require(`body-parser`);
  const app = express();
  const port = process.env.CARBONE_PORT || 3030;
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.post('/render', function(request, response) {
      const data = request.body.data
      const template = request.body.template
      const options = request.body.options
      const reportname = request.body.reportname
      try {
          carbone.render(template, data, options, function(err, result) {
              if (err) return console.log(err);
              fs.writeFileSync('output/' + reportname, result);
          });

      } catch (err) {
       
        response.send(err);
      }
      response.send(reportname);
  })

  app.listen(port, () => console.log(`Carbone wrapper listenning on port ${port}!`));