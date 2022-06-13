import fetch from 'node-fetch';


// 671392 671489 671359
let court_ids = [109543, 109544, 109545];
const cookie = 'tuni-cookie-agreed=2; giosg_gid_4932=uo34xtkyzf4mb46waiaaeqhzdtyjq2ir5sqi6ascvqjaabqm; giosg_chat_id_4932=qqxx4oiizy7qfzvetaaapwf7y53qqdge4vtmhmxr6vbhccym; _hjSessionUser_1666125=eyJpZCI6Ijk2M2QxYjMzLWI2ODItNTJlYi1iNjJmLWQxYTA5ODc1MDg4MiIsImNyZWF0ZWQiOjE2NDY5OTUxMjM0NTEsImV4aXN0aW5nIjp0cnVlfQ==; _ga_G52R8486BX=GS1.1.1648210649.4.0.1648210649.0; _ga=GA1.2.913729667.1644322873; _ga_XWBJWEFREF=GS1.1.1648541181.2.1.1648541668.0; AMCV_4D6368F454EC41940A4C98A6%40AdobeOrg=-2121179033%7CMCIDTS%7C19086%7CMCMID%7C18509133857437770943248764652159108437%7CMCAAMLH-1649602629%7C6%7CMCAAMB-1649602629%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCOPTOUT-1649005029s%7CNONE%7CMCAID%7CNONE%7CMCCIDH%7C1611803738%7CvVersion%7C5.3.0; mbox=session#496df7f3e8814a9bbc3b417570630000#1648999693|PC#496df7f3e8814a9bbc3b417570630000.37_0#1712242633; s_pers=%20v8%3D1649000335747%7C1743608335747%3B%20v8_s%3DFirst%2520Visit%7C1649002135747%3B; _gid=GA1.2.1255491016.1650348163; lb_selection=1541596802.47873.0000; _shibsession_77656270616765732e74756e692e666968747470733a2f2f776562686f74656c342e74756e692e66692f73686962626f6c657468=_d7b2863c00f74b96ea4abb01379dac71';

const url_calendar = 'https://www.tuni.fi/sportuni/omasivu/?page=myevents&lang=en';

const cancelBooking = async ()=> {
    let data = await fetch(url_calendar, {
        headers: {
            cookie
        }
    })
    data = await data.text();
    console.log(data);

    court_ids.forEach(async court_id=> {
        const url_cancel = `https://www.tuni.fi/sportuni/omasivu/?lang=en&action=cancel&id=${court_id}`;
        let data = await fetch(url_cancel, {
            headers: {
              cookie: cookie
            }
        })
    })
}

await cancelBooking();