import fetch from 'node-fetch';

// START USER INPUT
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const cookie = '';
const start_date = '2022-04-02'; // yyyy-mm-dd
const end_date = '2022-04-02'; // yyyy-mm-dd
const desire_start_times = [16];
const desire_court_nums = [5, 2, 4, 3];
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// END USER INPUT

const url_get = `https://www.tuni.fi/sportuni/kalenteri/?lang=en&embedded=1&type=2&a1=false&a2=true&a3=false&a4=false&ajax=1&start=${start_date}&end=${end_date}&_=1647456934063`;
// loop until there is available list of bookings
let succeedBookCount = 0;
let isBooked = false;




let startBooking = async () => {

  let data = await fetch(url_get);
  data = await data.json();

  if (data.length > 1) {
    let shifts = await handleShiftList(data);
    await handleBookCourt(shifts);
  }

}


let handleShiftList= async (text) => {
  // danh sach san book duoc
  console.log(text)

  const shifts = text.filter(shift => {
    const time = shift['start'].substring(11, 13);
    return shift['color'] == '#8724C1' && desire_start_times.some(desire_time => desire_time == time)
  })

  return shifts.map((shift)=> {
    return {
      start_time: parseInt(shift['start'].substring(11, 13)),
      id: shift.id
    }
  })
}

let handleBookCourt = async (shifts) => {

  for(let i = 0; i<shifts.length; i++) {
    const shift = shifts[i];
    const url_event = `https://www.tuni.fi/sportuni/kalenteri/showevent.cgi?lang=en&id=${shift.id}`;


    let data = await fetch(url_event);
    data = await data.text();
    const courts =  findCourt(data);
    await bookCourt(courts);
  }
}

let findCourt = text => {

  return desire_court_nums.map(desire_court_num => {
    const regex = new RegExp(`&court=${desire_court_num}`, 'g');
    const search_point = text.search(regex);
    const raw_id_length = 9;
    const court_id_raw = text.slice(search_point - raw_id_length, search_point);
    const court_id = court_id_raw.substring(3);
    return {
      court_id,
      court_num: desire_court_num
    }
  })
}

let bookCourt = async courts => {

  for(let i=0; i<courts.length; i++) {
    const court = courts[i];

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
      console.log(`Book không được sân ${court.court_num}!`)
    }
    else {
      succeedBookCount++;
      if (succeedBookCount >= 3) {
        isBooked = true;
      }
      console.log(succeedBookCount);
      console.log(`Book sân ${court.court_num} thành công!`)
    }
  }
}


async function bookTillFull() {
  while (!isBooked) {
    let data = await startBooking();
    let a = 99;
  }

  if (isBooked) {
    console.log ("ĐÃ BOOK ĐỦ HẾT SÂN!");
  }
}



bookTillFull();