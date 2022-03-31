import fetch from 'node-fetch';

// START USER INPUT
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const cookie = '_gid=GA1.2.1272627267.1647096070; lb_selection=1541596802.47873.0000; intra_uuid=8729da81-6718-4acb-a9a3-f06f09733d88; _hjSessionUser_1666125=eyJpZCI6ImZhOGE3ZTg4LTg5ZmQtNTBlMy1iZDc5LWExNTE4MTY3ZDY4YiIsImNyZWF0ZWQiOjE2NDc1NDQzODQ0MjksImV4aXN0aW5nIjp0cnVlfQ==; at_check=true; AMCVS_4D6368F454EC41940A4C98A6%40AdobeOrg=1; _ga=GA1.2.1324647022.1647096070; _ga_XWBJWEFREF=GS1.1.1648308554.2.1.1648308584.0; AMCV_4D6368F454EC41940A4C98A6%40AdobeOrg=-2121179033%7CMCIDTS%7C19082%7CMCMID%7C28771363418298948114077891073556761231%7CMCAID%7CNONE%7CMCOPTOUT-1648669706s%7CNONE%7CMCAAMLH-1649267306%7C6%7CMCAAMB-1649267306%7Cj8Odv6LonN4r3an7LhD3WZrU1bUpAkFkkiY1ncBR96t2PTI%7CMCCIDH%7C1611803738%7CMCSYNCSOP%7C411-19083%7CvVersion%7C5.3.0; mbox=PC#3e651271e47b4302a4658e1fd0717a73.37_0#1711907311|session#63ab6ad8a2c045e08c3e45a2068d287d#1648664371; s_pers=%20c19%3Dknovel%2520pi%253Aviewer%253Akhtml%253Aother%253A15%2520viewer%2520page%7C1648666284047%3B%20v68%3D1648662512103%7C1648666284051%3B%20v8%3D1648664604728%7C1743272604728%3B%20v8_s%3DLess%2520than%25207%2520days%7C1648666404728%3B; s_sess=%20s_cpc%3D0%3B%20s_ppvl%3Dknovel%252520pi%25253Aviewer%25253Akhtml%25253Aother%25253A15%252520viewer%252520page%252C100%252C100%252C1289%252C2512%252C1289%252C2560%252C1440%252C1.5%252CP%3B%20s_cc%3Dtrue%3B%20s_sq%3D%3B%20e41%3D1%3B%20v60%3Dcreating%2520a%2520simple%2520visualization%3B%20s_ppv%3Dknovel%252520pi%25253Aviewer%25253Akhtml%25253Aother%25253A15%252520viewer%252520page%252C100%252C100%252C1289%252C2512%252C1289%252C2560%252C1440%252C1.5%252CP%3B; _gat=1; _gat_tunisites=1; _shibsession_77656270616765732e74756e692e666968747470733a2f2f776562686f74656c342e74756e692e66692f73686962626f6c657468=_5f8f0daa37d20c92e6078de3b47aa71e';
const start_date = '2022-04-10'; // yyyy-mm-dd
const end_date = '2022-04-10'; // yyyy-mm-dd
const desire_start_times = [11, 12];
const desire_court_nums = [5, 4];
const sportUniLocation = { // ONLY ONE SHOULD BE TRUE
  hervanta: true,
  center: false,
  kauppi: false,
  otherLocations: false
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// END USER INPUT

// loop until there is available list of bookings
let succeedBookCount = 0;
let isBooked = false;




let startBooking = async () => {
  // fetch the calendar to see if there is available courts at that date
  const url_get = `https://www.tuni.fi/sportuni/kalenteri/?lang=en&embedded=1&type=2&a1=${sportUniLocation.kauppi}&a2=${sportUniLocation.hervanta}&a3=${sportUniLocation.center}&a4=${sportUniLocation.otherLocations}&ajax=1&start=${start_date}&end=${end_date}&_=1647456934063`;
  let data = await fetch(url_get);
  data = await data.json();

  // Only start booking when the calendar have date available
  if (data.length > 1) {
    let shifts = handleShiftList(data);
    await handleBookCourt(shifts);
  }

}


let handleShiftList= (text) => {
  // log the available courts at the desired date found
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

  for(let i = 0; i < shifts.length; i++) {
    const shift = shifts[i];
    const url_event = `https://www.tuni.fi/sportuni/kalenteri/showevent.cgi?lang=en&id=${shift.id}`;

    // Get the available court depending on the shift id
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

  for(let i = 0; i < courts.length; i++) {
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