var express = require('express');
var exphbs  = require('express-handlebars');
const bodyParser = require("body-parser");
var port = process.env.PORT || 3000
const mercadopago = require('mercadopago');
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
mercadopago.configure({
    integrator_id: 'dev_24c65fb163bf11ea96500242ac130004',
    access_token: 'APP_USR-334491433003961-030821-12d7475807d694b645722c1946d5ce5a-725736327'
  });

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.static('assets'));
 
app.use('/assets', express.static(__dirname + '/assets'));

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/detail', function (req, res) {
    res.render('detail', req.query);
});
app.get('/success', function (req, res) {
  res.render('success', req.query);
});
app.get('/pending', function (req, res) {
  res.render('pending', req.query);
});
app.get('/failure', function (req, res) {
  res.render('failure', req.query);
});
app.post('/hook', function (req, res) {
  console.log(req.body)
  res.render('success', req);
});

app.post('/detail', function (req, res) {

    let preference = {
        items: [
          {
            title: req.query.title,
            unit_price: Number(req.query.price),
            quantity: 1,
            "description": "Celular de Tienda e-commerce",
            "picture_url":req.protocol + "://" + req.get('host')+req.query.img.substr(1),
            "external_reference":"ramongemio@gmail.com"
          }
        ],
        back_urls: {
          "success": req.protocol + "://" + req.get('host') +"/success",
          "failure": req.protocol + "://" + req.get('host') +"/failure",
          "pending": req.protocol + "://" + req.get('host') +"/pending",
        },
        auto_return: 'approved',
        payer: {
            name: "Lalo",
            surname: "Landa",
            email: "test_user_92801501@testuser.com",
            phone: {
                area_code: "55",
                number: 985298743
            },
            // identification: {
            //     type: "CPF",
            //     number: "19119119100"
            // },
            address: {
                street_name: "Insurgentes Sur",
                street_number: 1602,
                zip_code: "78134190"
            },
            
        },
        payment_methods: {
            excluded_payment_methods: [
                {
                    "id": "amex"
                }
            ],
            installments: 6
        },
        notification_url: req.protocol + "://" + req.get('host') +"/hook",
        external_reference: "ramongemio@gmail.com"
      };
      console.log(preference)
      mercadopago.preferences.create(preference)
      .then(function(preference){
        // Este valor substituirá o string "$init_point$" no seu HTML
        console.log(preference)
        global.init_point = preference.body.init_point;
        res.redirect(global.init_point);
       // console.log(preference.body);
      }).catch(function(error){
        console.log(error);
      });
})

app.listen(port);