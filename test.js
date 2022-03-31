let a = [1, 1, 3, 4]

function abc() {
    a.some((b, i)=>{

        console.log(i)
        return b === 1
    } )
}

abc()