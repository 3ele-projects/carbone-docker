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
  const render = util.promisify(carbone.render);

  app.use(bodyParser.json({limit: '50mb', type: 'application/json'}));
  app.use(bodyParser.urlencoded({ 
  extended: true, 
  parameterLimit: 100000,
  limit: '50mb',
  }));


const upload = require(`multer`)({ dest: `output/` });

  app.post('/render', upload.single(`template`), async (request, res) => {
    const data = request.body.data
    const template = request.body.template
    const options = request.body.options
    const reportname = request.body.reportname
    console.log(template)
    let report = null;
    try {
      report = await render(template, data, options);
    } catch (e) {
      console.log(e);
      return res.status(500).send(`Internal server error`);
    }
         
    res.setHeader(`Content-Disposition`, `attachment; filename=${reportname}`);
    res.setHeader(`Content-Transfer-Encoding`, `binary`);
    res.setHeader(`Content-Type`, `application/octet-stream`);
    res.setHeader(`Carbone-Report-Name`, reportname);
    return res.send(report);
})

  app.listen(port, () => console.log(`Carbone asdfsd wrapper listenning on port ${port}!`));
