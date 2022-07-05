let vCardsJS = require('vcards-js');

//create a new vCard
let vCard = vCardsJS();

//set properties
vCard.firstName = 'Nguyên';
vCard.middleName = 'Thảo';
vCard.lastName = 'Nguyễn';
vCard.organization = 'Công ty cổ phần IDTEK';
vCard.photo.attachFromUrl('https://scontent.fdad3-4.fna.fbcdn.net/v/t1.6435-9/165864812_2933160610285745_8859634258068977256_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=730e14&_nc_ohc=MMTQm_9F0HMAX88jYWW&_nc_oc=AQkxCdksMQ61tHJqmyV7mbRvmBOw3JSJnMhC2nia5HBu_KoFQF50DYrzy8m4w756bgc&_nc_ht=scontent.fdad3-4.fna&oh=00_AT9CFoo5tnIH9SYx-XiuXSzaROM7Okdk2QldxvmvpkLrJw&oe=62EB7B3C')
vCard.logo.attachFromUrl('https://scontent.fdad3-4.fna.fbcdn.net/v/t1.6435-9/165864812_2933160610285745_8859634258068977256_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=730e14&_nc_ohc=MMTQm_9F0HMAX88jYWW&_nc_oc=AQkxCdksMQ61tHJqmyV7mbRvmBOw3JSJnMhC2nia5HBu_KoFQF50DYrzy8m4w756bgc&_nc_ht=scontent.fdad3-4.fna&oh=00_AT9CFoo5tnIH9SYx-XiuXSzaROM7Okdk2QldxvmvpkLrJw&oe=62EB7B3C')

vCard.title = 'Account Manager';
vCard.workPhone = '+842862885088';
vCard.homePhone = '+84868498440';

//set address information
vCard.homeAddress.label = 'Home Address';
vCard.homeAddress.street = '90 Đường 85';
vCard.homeAddress.city = 'Quận 7';
vCard.homeAddress.stateProvince = 'Hồ Chí Minh';
vCard.homeAddress.postalCode = '756700';
vCard.homeAddress.countryRegion = 'Việt Nam';

//set email addresses
vCard.email = 'nguyen.nguyen@idtek.com.vn';
vCard.workEmail = 'info@idtek.com.vn';

// url
vCard.url = 'https://idtek.com.vn/';
vCard.workUrl = 'https://idtek.com.vn/';

//set social media URLs
vCard.socialUrls['facebook'] = 'https://www.facebook.com/carina.thaonguyen';
// vCard.socialUrls['linkedIn'] = 'https://...';
// vCard.socialUrls['twitter'] = 'https://...';
// vCard.socialUrls['flickr'] = 'https://...';
// vCard.socialUrls['custom'] = 'https://...';


// version
vCard.version = '3.0';

//save to file
// vCard.saveToFile('../vcard/thao-nguyen.vcf');

//get as formatted string
// console.log(vCard.getFormattedString());

module.exports = vCard;