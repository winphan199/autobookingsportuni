const express = require('express')
const http = require('http')
const {Server} = require('socket.io')
const morgan = require('morgan')
const cors = require('cors')
const {findDateRange, findLocations} = require('./lib/helper.js')
const startBooking = require('./lib/autobook.js')
const app = express()
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});
const port = 3000


// HTTP logger
app.use(morgan('combined'))

// enable cors policy for all route
app.use(cors())

// json middlewares
app.use(express.json())


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

let isStop = false;
let isConnected = false;

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/book', (req, res) => {
  console.log(req.body)
  res.send('')
})

app.post('/book', async (req, res) => {

  isStop = true;
  isStop = false;

  // get book list
  toBookList = req.body;
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

  // start booking

  // loop until there is available list of bookings
  let bookCount = 0;
  do {
    if (isStop) {
      break;
    }
    bookCount = await startBooking(generalInfo, toBookList, isConnected, io);
  } while (!isStop && bookCount < 3);
  console.log("bookTillFull " + bookCount);
  if (bookCount >= 3) {

    console.log ("ĐÃ BOOK ĐỦ HẾT SÂN!");
  }

  res.json({
    'status': 'OK',
    'isStop': isStop
  })
})

app.get('/stop', (req, res) => {

  isStop = true;

  res.json({
    'status': 'OK',
  })
})

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);
  isConnected = true;
});


server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})