function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
 }

async function test() {
    // for(let i=0; i<10; i++) {
    //     console.log("Hello");
    //     await sleep(1000);
    // }

    let i = 0
    while (i < 10) {
        console.log("Hello");
        await sleep(1000);
        i++;
    }
}

test();