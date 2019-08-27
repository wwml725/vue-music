function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

let list = [{name:"www"},{name:"mm"}];
let song = {name:"www"}
console.log(findIndex(list, song));

//

function findd(item) {
  return item.id===song.id
}
