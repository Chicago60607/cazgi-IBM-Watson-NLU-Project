const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

function getNLUInstance() {
    let api_key = process.env.API_KEY;
    let api_url = process.env.API_URL;

    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
        version: '2020-08-01',
        authenticator: new IamAuthenticator({
        apikey: api_key,
        }),
        serviceUrl: api_url,
    });

    return naturalLanguageUnderstanding;
}

const naturalLanguageUnderstanding = getNLUInstance();

const app = new express();

app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());

app.get("/",(req,res)=>{
    res.render('index.html');
  });

app.get("/url/emotion", (req,res) => {
    getNLUInstance();
    const analyzeParams = {
    'url': req.query.url,
    'features': {
        'emotion': {}
    }
    };
    naturalLanguageUnderstanding.analyze(analyzeParams)
    .then(analysisResults => {
        const emotion = analysisResults.result.emotion.document.emotion;
        return res.send(emotion);
    })
    .catch(err => {
        console.log('error:', err);
    });
//    return res.send({"happy":"90","sad":"10"});
});

app.get("/url/sentiment", (req,res) => {
const analyzeParams = {
  'url': req.query.url,
  'features': {
    'sentiment': {}
  }
};

naturalLanguageUnderstanding.analyze(analyzeParams)
  .then(analysisResults => {
    console.log(JSON.stringify(analysisResults, null, 2));
    const sentiment = analysisResults.result.sentiment.document.label;
    return res.send(sentiment);
  })
  .catch(err => {
    console.log('error:', err);
  });
    //    return res.send("url sentiment for "+req.query.url);
});

app.get("/text/emotion", (req,res) => {
    getNLUInstance();
    const analyzeParams = {
    'text': req.query.text,
    'features': {
        'emotion': {}
    }
    };
    naturalLanguageUnderstanding.analyze(analyzeParams)
    .then(analysisResults => {
        const emotion = analysisResults.result.emotion.document.emotion;
        return res.send(emotion);
    })
    .catch(err => {
        console.log('error:', err);
    });
    //    return res.send({"happy":"10","sad":"90"});
});

app.get("/text/sentiment", (req,res) => {
const analyzeParams = {
  'text': req.query.text,
  'features': {
    'sentiment': {}
  }
};

naturalLanguageUnderstanding.analyze(analyzeParams)
  .then(analysisResults => {
    console.log(JSON.stringify(analysisResults, null, 2));
    const sentiment = analysisResults.result.sentiment.document.label;
    return res.send(sentiment);
  })
  .catch(err => {
    console.log('error:', err);
  });
    //    return res.send("text sentiment for "+req.query.text);
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})
