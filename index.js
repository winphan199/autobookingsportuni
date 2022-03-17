import fetch from 'node-fetch';

const cookie = '_ga=GA1.2.1324647022.1647096070; _gid=GA1.2.1272627267.1647096070; lb_selection=1541596802.47873.0000; _shibsession_77656270616765732e74756e692e666968747470733a2f2f776562686f74656c342e74756e692e66692f73686962626f6c657468=_b4ef631df28f2d48a267717602c61c03; _gat=1; _gat_tunisites=1';
const start_date = '2022-03-27'; // yyyy-mm-dd
const end_date = '2022-03-27'; // yyyy-mm-dd
const desire_start_times = [12];
const desire_court_nums = [1, 2, 3];
const url_get = `https://www.tuni.fi/sportuni/kalenteri/?lang=en&embedded=1&type=2&a1=false&a2=true&a3=false&a4=false&ajax=1&start=${start_date}&end=${end_date}&_=1647456934063`;


// loop until there is available list of bookings
let succeedBookCount = 0;
let isBooked = false;




let startBooking = async () => {
  await fetch(url_get)
    .then(res => res.json())
    .then(text => {
      if (text.length > 1) {
        return handleShiftList(text);
      }
      else
        return -1;
    })
    .then(shifts=> {
      if (shifts != -1)
        handleBookCourt(shifts);
    })
    .catch(e=>console.log(e))
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

  shifts.forEach(shift => {
    const url_event = `https://www.tuni.fi/sportuni/kalenteri/showevent.cgi?lang=en&id=${shift.id}`;


    fetch(url_event)
    .then(res => res.text())
    .then(text=> {

      return findCourt(text);
    })
    .then(courts => {
      bookCourt(courts);
    })
  });
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

  courts.forEach(court => {

    const url_book = `https://www.tuni.fi/sportuni/omasivu/?lang=en&action=badminton&id=${court.court_id}&court=${court.court_num}`
    fetch(url_book, {
      headers: {
        cookie: cookie
      }
    })
    .then(res=>res.text())
    .then(text => {

      //console.log(text) // response thanh cong || that bai
      const regex = new RegExp(`Thank you`, 'g');
      const pos_of_success = text.search(regex);
      if (pos_of_success < 0) {
        // book failed
        console.log('Book khong duoc san')
      }
      else {
        succeedBookCount++;
        if (succeedBookCount >= 3) {
          isBooked = true;
        }
        console.log(succeedBookCount);
        console.log('Book san thanh cong')
      }
    })

  })
}


while (!isBooked) {
  await startBooking();
  if (isBooked) {
    console.log("ĐÃ BOOK ĐỦ HẾT SÂN");
    break;
  }
}

