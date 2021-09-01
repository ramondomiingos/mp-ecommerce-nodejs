var express = require('express');
var exphbs  = require('express-handlebars');
var port = process.env.PORT || 3000
const mercadopago = require('mercadopago');
var app = express();
mercadopago.configure({
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

app.post('/detail', function (req, res) {
   
    
    console.log(req.body)
  
    let preference = {
        items: [
          {
            title: 'Meu produto',
            unit_price: 100,
            quantity: 1,
          }
        ],
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
        external_reference: "ramongemio@gmail.com"
      };
      mercadopago.preferences.create(preference)
      .then(function(preference){
        // Este valor substituirá o string "$init_point$" no seu HTML
        global.init_point = preference.body.init_point;
        res.render('detail', req.query);
       // console.log(preference.body);
      }).catch(function(error){
        console.log(error);
      });
})

app.listen(port);