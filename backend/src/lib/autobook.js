// import fetch from 'node-fetch';
const fetch = require('node-fetch');

// START USER INPUT
const toBookListt = [
  {
    location: 'hervanta',
    date: '2022-06-10',
    booking_details: [
      {
        start_time: 11,
        court_nums: [4, 5]
      },
      {
        start_time: 12,
        court_nums: [5]
      },
      {
        start_time: 15,
        court_nums: [2, 3]
      },
      {
        start_time: 16,
        court_nums: [2]
      }
    ],
  },
  {
    location: 'hervanta',
    date: '2022-06-12',
    booking_details: [
      {
        start_time: 11,
        court_nums: [4, 5]
      },
      {
        start_time: 12,
        court_nums: [5]
      }
    ],
  },
]

const generalInfo = {
  cookie: '',
  start_date: '2022-06-10', // yyyy-mm-dd
  end_date: '2022-06-12', // yyyy-mm-dd
  sportUniLocation: {
    hervanta: true,
    center: false,
    kauppi: false,
    otherLocations: false
  }
}
// END USER INPUT




let startBooking = async ({cookie, start_date, end_date, sportUniLocation}, toBookList, isConnected, io) => {
  // fetch the calendar to see if there is available courts at that date
  const url_get = `https://www.tuni.fi/sportuni/kalenteri/?lang=en&embedded=1&type=2&a1=${sportUniLocation.kauppi}&a2=${sportUniLocation.hervanta}&a3=${sportUniLocation.center}&a4=${sportUniLocation.otherLocations}&ajax=1&start=${start_date}&end=${end_date}&_=1647456934063`;
  let data = await fetch(url_get);
  data = await data.json();

  // Only start booking when the calendar have date available
  if (data.length > 1) {

    let shifts = handleShiftList(data, toBookList, isConnected, io);

    return await handleBookCourt(shifts, cookie, isConnected, io);
  }
  else {
    return 0;
  }

}


let handleShiftList= (text, toBookList, isConnected, io) => {
  // log the available courts at the desired date found
  if (isConnected) {

    console.log(text)
    io.emit('result log', text)
  }

  const shifts = text.filter(shift => {
    // get the date, time, location from return data from server
    const date = shift['start'].substring(0, 10);
    const time = parseInt(shift['start'].substring(11, 13));
    let location = '';
    if (shift['title'].includes('hall\nKauppi')) {

      location = shift['title'].substring(17).toLowerCase();
    }
    else if (shift['title'].includes('court\nKauppi')) {
      location = shift['title'].substring(11).toLowerCase();
    }
    else {

      location = shift['title'].substring(10).toLowerCase();
    }



    return shift['color'] == '#8724C1' && toBookList.some(option=> {

      return option['location'] == location &&
             option['date'] == date &&
             option['booking_details'].some(desire_shift => {
               return desire_shift['start_time'] == time
             });
    });
  })


  return shifts.map((shift)=> {

    // get the date, time, location from return data from server
    const date = shift['start'].substring(0, 10);
    const start_time = parseInt(shift['start'].substring(11, 13));
    let location = '';
    if (shift['title'].includes('hall\nKauppi')) {

      location = shift['title'].substring(17).toLowerCase();
    }
    else if (shift['title'].includes('court\nKauppi')) {
      location = shift['title'].substring(11).toLowerCase();
    }
    else {

      location = shift['title'].substring(10).toLowerCase();
    }
    const toBookListItem = toBookList.find(option=> {
      return option.location == location &&
             option.date == date;
    });
    const booking_detail = toBookListItem.booking_details.find(desire_shift=> {
      return desire_shift.start_time == start_time;
    });
    let court_nums = [];
    let total_courts = 0;

    console.log(toBookListItem)
    if (toBookListItem != undefined) {
      console.log(booking_detail);
      court_nums = booking_detail.court_nums;
      total_courts = toBookListItem.total_courts;
    }
    

    return {
      location,
      date,
      start_time,
      court_nums,
      total_courts,
      id: shift.id
    }
  })
}

let handleBookCourt = async (shifts, cookie, isConnected, io) => {

  let bookCount = 0;

  for(let i = 0; i < shifts.length; i++) {
    const shift = shifts[i];
    const url_event = `https://www.tuni.fi/sportuni/kalenteri/showevent.cgi?lang=en&id=${shift.id}`;

    // Get the available court depending on the shift id
    let data = await fetch(url_event);
    data = await data.text();
    const courts =  findCourt(data, shift);

    if (isConnected) {

      console.log(courts);
      io.emit('result log', courts)
    }
    bookCount = await bookCourt(courts, cookie, bookCount, isConnected, io);
  }
  return bookCount;
}

let findCourt = (text, {court_nums, location, date, start_time}) => {

  return court_nums.map(desire_court_num => {
    const regex = new RegExp(`&court=${desire_court_num}`, 'g');
    const search_point = text.search(regex);
    const raw_id_length = 9;
    const court_id_raw = text.slice(search_point - raw_id_length, search_point);
    const court_id = search_point == -1 ? -1 : court_id_raw.substring(3);
    return {
      location,
      date,
      start_time,
      court_num: desire_court_num,
      court_id
    }
  })
}

let bookCourt = async (courts, cookie, succeedBookCount, isConnected, io) => {


  for(let i = 0; i < courts.length; i++) {
    const court = courts[i];
    if (court.court_id == -1) {
      continue;
    }

    const url_book = `https://www.tuni.fi/sportuni/omasivu/?lang=en&action=badminton&id=${court.court_id}&court=${court.court_num}`
    let data = await fetch(url_book, {
      headers: {
        cookie: cookie
      }
    })
    data = await data.text();
    const regex = new RegExp(`Thank you`, 'g');
    const pos_of_success = data.search(regex);
    if (pos_of_success < 0) {
      // book failed
      if (isConnected) {

        console.log(data);
        io.emit('result log', data)
        console.log(`Book không được sân ${court.court_num}! ngày ${court.date} lúc ${court.start_time} giờ`)
        io.emit('result log', `Book không được sân ${court.court_num}! ngày ${court.date} lúc ${court.start_time} giờ`)
      }
    }
    else {
      // book success
      succeedBookCount++;

      if (isConnected) {

        console.log(`Book sân ${court.court_num} ngày ${court.date} lúc ${court.start_time} giờ thành công!`)
        io.emit('result log', `Book sân ${court.court_num} ngày ${court.date} lúc ${court.start_time} giờ thành công!`)
      }
      if (succeedBookCount >= 3) {
        break;
      }
    }
  }

  return succeedBookCount;
}


async function bookTillFull({toBookList, generalInfo, isStop}) {
  // loop until there is available list of bookings
  let bookCount = 0;
  do {
    bookCount = await startBooking(generalInfo, toBookList);
    console.log(isStop);
  } while (!isStop && bookCount < 3);
  console.log("bookTillFull " + bookCount);
  console.log ("ĐÃ BOOK ĐỦ HẾT SÂN!");
}

module.exports = startBooking;



//bookTillFull(toBookListt, generalInfo);