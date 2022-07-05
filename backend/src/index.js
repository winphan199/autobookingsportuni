const express = require('express')
require('dotenv').config()
const http = require('http')
const {Server} = require('socket.io')
const morgan = require('morgan')
const cors = require('cors')
const {findDateRange, findLocations} = require('./lib/helper.js')
const startBooking = require('./lib/autobook.js')
const vCard = require('./lib/vcard.js')
const app = express()
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

const port = process.env.PORT || 3000

// HTTP logger
app.use(morgan('combined'))

// enable cors policy for all route
app.use(cors())

// json middlewares
app.use(express.json())


const requestList = [];

let isStop = false;
let isConnected = false;

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/book', async (req, res) => {
  console.log(req.body);
  let toBookList = [];
  const generalInfo = {
    cookie: '',
    start_date: '', // yyyy-mm-dd
    end_date: '', // yyyy-mm-dd
    sportUniLocation: {
      hervanta: false,
      center: false,
      kauppi: false,
      otherLocations: false
    }
  }

  // get book list
  toBookList = req.body.requestData;
  if (toBookList.length <= 0) {
    res.status(400).json({
      'status': 'Failed',
      'msg': 'List is empty'
    })
    return;
  }

  // get cookie
  generalInfo.cookie = toBookList[0]?.cookie != undefined ? toBookList[0]?.cookie : '';
  if (generalInfo.cookie == '') {
    res.status(400).json({
      'status': 'Failed',
      'msg': 'Cookie is empty'
    })

    return;
  }

  // check empty booking details
  for (const key in toBookList) {
    if (Object.hasOwnProperty.call(toBookList, key)) {
      const element = toBookList[key]?.booking_details;

      if (element.length <= 0) {
        res.status(400).json({
          'status': 'Failed',
          'msg': 'booking_details is empty'
        })

        return;
      }

      // check empty court numbers
      for (const iterator of element) {
        if (iterator?.court_nums.length <= 0) {
          res.status(400).json({
            'status': 'Failed',
            'msg': 'court_nums is empty'
          })

          return;
        }
      }
    }
  }

  // get Date range
  const {maxDate, minDate} = findDateRange(toBookList);
  generalInfo.start_date = minDate;
  generalInfo.end_date = maxDate;

  // get Location range
  const locationList = findLocations(toBookList);

  for (const location in generalInfo.sportUniLocation) {
    if (Object.hasOwnProperty.call(generalInfo.sportUniLocation, location)) {

      const element = locationList.find(e => {
        return e == location;
      })

      generalInfo.sportUniLocation[location] = element == undefined ? false : true;
    }
  }

  const requestItem = {
    socket_id: req.body.socket_id,
    generalInfo,
    toBookList
  }

  // start booking
  const bookCount = await startBooking(requestItem.generalInfo, requestItem.toBookList, isConnected, io, requestItem.socket_id);

  res.json({
    status: 'OK',
    bookCount,
  })
})

app.get('/book', (req, res) => {
  // console.log(req.body)
  res.send('This is book route')
})

app.get('/vcard/thao-nguyen', (req, res) => {
  //set content-type and disposition including desired filename
  res.set('Content-Type', 'text/vcard; name="thaonguyen.vcf"');
  res.set('Content-Disposition', 'inline; filename="thaonguyen.vcf"');

  //send the response
  res.send(vCard.getFormattedString());
})



io.on('connection', (socket) => {
  console.log('a user connected', socket.id);
  isConnected = true;
});


server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})