import rxjs from "rxjs"

const { range } = rxjs
const { filter, take, map, toArray } = rxjs

range(1, 20)
.pipe(
  filter(n => n % 2 === 0),
  take(5),
  map(n => Math.pow(n, 2)),
  toArray(),
  map(arr => arr.join(", "))
)
.subscribe(console.log)