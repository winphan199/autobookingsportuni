# Auto booking SportUni

Auto booking tool for SportUni website

## How it works
---

- This tool will keep running until 3 courts are successfully booked.
- If the console log out "ĐÃ BOOK ĐỦ HẾT SÂN!" it means you have booked 3 courts.
- If you only want to book < 3 courts => the tool keeps running so you have to stop it manually. (I will upgrade it later :heart_eyes:)
- For anyone wants to know how to get the cookie => Read `howtogetcookie.docx` in the folder.

## Installation
---

Clone the project to your folder

```bash
git clone https://github.com/winphan199/autobookingsportuni.git
```

Redirect to your folder

```bash
cd /<your_folder>/autobookingsportuni/
```

Install required files

```bash
npm install
```

## Execution
---

Add your cookie

```javascript
const cookie = '<your_cookie>';
```

Set the start date and end date of desired booking date

```javascript
const start_date = '2022-04-02'; // yyyy-mm-dd
const end_date = '2022-04-02'; // yyyy-mm-dd
```

Set the start time you want to book on that date

```javascript
const desire_start_times = [<start_time1>, <start_time2>];
```

Set the court numbers that you want to book on that date at that time

```javascript
// The court number's priority will decrease from left -> right
const desire_court_nums = [5, 2, 4, 3];
```

Run tool with this command

```bash
node index.js
```

## Contributing
Hung Phan (WIN DEP TRAI)