import rxjs from "rxjs"

const { from } = rxjs
const { first, last, elementAt, filter, distinct, count } = rxjs.operators

const obs$ = from([
    9, 3, 10, 5, 1, 10, 9, 9, 1, 4, 1, 8, 6, 2, 7, 2, 5, 5, 10, 2
])

obs$.pipe(first()).subscribe(x => console.log('first: ' + x))
obs$.pipe(last()).subscribe(x => console.log('last: ' + x))
// index 0,1,2,...
obs$.pipe(elementAt(5)).subscribe(x => console.log('elementAt: ' + x))
obs$.pipe(
// set 처럼 만들어주는 함수
	distinct(),
  count()
).subscribe(x => console.log('distinct: ' + x))

const { from } = rxjs
const { pluck } = rxjs.operators

const obs$ = from([
    { name: 'apple', price: 1200, info: { category: 'fruit' } },
    { name: 'carrot', price: 800, info: { category: 'vegetable' } },
    { name: 'pork', price: 5000, info: { category: 'meet' } },
    { name: 'milk', price: 2400, info: { category: 'drink' } }
])


// pluck -> 뽑아낼 항목의 key만 적어주면 된다.
obs$.pipe(
    pluck('price')
).subscribe(console.log)

// 하위 항목에 대한 연결이 가능하다.
obs$.pipe(
  pluck('info', 'category'),
).subscribe(console.log)

const { ajax } = rxjs.ajax
const { pluck } = rxjs.operators

const obs$ = ajax(`https://api.github.com/search/users?q=user:mojombo`).pipe(
    pluck('response', 'items', 0, 'html_url')
)
obs$.subscribe(console.log)

const { range } = rxjs
const { toArray, filter } = rxjs.operators

range(1, 50).pipe(
    filter(x => x % 3 === 0),
    filter(x => x % 2 === 1),
    // 값이 전부 나올때를 기다린다
    toArray()
).subscribe(console.log)

const { of } = rxjs
const { reduce, scan } = rxjs.operators

const obs$ = of(1, 2, 3, 4, 5)

obs$.pipe(
    reduce((acc, x) => { return acc + x }, 0)
).subscribe(x => console.log('reduce: ' + x))

obs$.pipe(
		// 모든 과정에 대한 행동을 할 때, 사용된다.
    scan((acc, x) => { return acc + x }, 0)
).subscribe(x => console.log('scan: ' + x))


const { from, interval, fromEvent, zip } = rxjs
const { pluck } = rxjs.operators
const obs1$ = from([1, 2, 3, 4, 5, 6, 7])
const obs2$ = from(['a', 'b', 'c'])
const obs3$ = from([true, false, 'F', [6, 7, 8], { name: 'zip' }])
const obs4$ = interval(1000)
const obs5$ = fromEvent(document, 'click').pipe(pluck('x'))

zip(obs4$, obs5$).subscribe(console.log)

const { range, interval, fromEvent } = rxjs
const { take, filter, pluck } = rxjs.operators

range(1, 20).pipe(
    take(5)
).subscribe(console.log)

range(1, 20).pipe(
    filter(x => x % 2 === 0),
    take(5)
).subscribe(console.log)

range(1, 20).pipe(
    take(5),
    filter(x => x % 2 === 0)
).subscribe(console.log)

interval(1000).pipe(
// take가 없다면, complete가 호출되지 않지만, take로 인해 더 이상 나올 값이 없으면 호출된다.
    take(5)
).subscribe(
    console.log,
    err => console.error(err),
    _ => console.log('COMPLETE')
)

const { range, interval, fromEvent } = rxjs
const { takeLast, take, pluck } = rxjs.operators

interval(1000).pipe(
// 끝이 없기 때문에 영원히 값을 출력할 수 없다.
// 그렇기 때문에 언제 스트림이 끝나는 것인지, 끝나기는 하는 것인지 고려해야 한다.
    takeLast(5)
).subscribe(
    console.log,
    err => console.error(err),
    _ => console.log('COMPLETE')
)

const { range, interval, fromEvent } = rxjs
const { takeWhile, takeLast, filter, pluck } = rxjs.operators

/* range(1, 20).pipe(
    takeWhile(x => x <= 10)
).subscribe(console.log) */

interval(1000).pipe(
    takeWhile(x => x < 5)
).subscribe(
    console.log,
    err => console.error(err),
    _ => console.log('COMPLETE')
)

fromEvent(document, 'click').pipe(
    pluck('x'),

    // ~하는 동안에만, 즉 문지기 역할
    takeWhile(x => x < 200),
).subscribe(
    console.log,
    err => console.error(err),
    _ => console.log('COMPLETE')
)

const { interval, timer, fromEvent } = rxjs
const { ajax } = rxjs.ajax
const { takeUntil, pluck, tap } = rxjs.operators

obs1$ = fromEvent(document, 'click')
obs2$ = timer(5000)
// 현재 게임에 사용해도 괜찮을 기능
obs1$.pipe(
    pluck('x'),
    takeUntil(obs2$)
).subscribe(
    console.log,
    err => console.error(err),
    _ => console.log('COMPLETE')
)

const { interval, timer, fromEvent } = rxjs
const { ajax } = rxjs.ajax
const { takeUntil, pluck, tap } = rxjs.operators

// spinner
interval(50).pipe(
    takeUntil(
        ajax('http://127.0.0.1:3000/people/name/random').pipe(
            pluck('response'),
            tap(console.log)
        )
    )
).subscribe(console.log)

const { range, interval, fromEvent } = rxjs
const { skipLast, pluck } = rxjs.operators

interval(1000).pipe(
// takelast와는 다르게, 5개 값이 밀려서 나온다
    skipLast(5)
).subscribe(
    console.log,
    err => console.error(err),
    _ => console.log('COMPLETE')
)

const { interval, timer, fromEvent } = rxjs
const { skipUntil, pluck } = rxjs.operators

const obs1$ = fromEvent(document, 'click')
const obs2$ = timer(5000)

// 5s 동안 클릭 이벤트를 차단하다가, 5초 이후 부터는 클릭 이벤트를 허용한다.
obs1$.pipe(
    pluck('x'),
    skipUntil(obs2$)
).subscribe(
    console.log,
    err => console.error(err),
    _ => console.log('COMPLETE')
)

const { fromEvent } = rxjs
const { ajax } = rxjs.ajax
const { timeout, pluck } = rxjs.operators

/* fromEvent(document, 'click').pipe(
    // 주어진 시간안에 다음 값이 미발행 시 오류를 발생시킨다.
    timeout(3000)
).subscribe(
    _ => console.log('OK'),
    err => console.error(err)) */

ajax('http://127.0.0.1:3000/people/name/random').pipe(
    pluck('response'),
    timeout(2000)
).subscribe(console.log, console.error)

const { fromEvent, interval, of } = rxjs
const { ajax } = rxjs.ajax
const { timeoutWith, pluck, scan } = rxjs.operators

/* fromEvent(document, 'click').pipe(
    timeoutWith(3000, interval(1000)),
    // 위에서 나오는 값
    scan((acc, x) => { return acc + 1 }, 0)
).subscribe(console.log) */

ajax('http://127.0.0.1:3000/people/name/random').pipe(
    pluck('response'),
    // 시간안에 응답이 오지 않으면 다른 값을 발행한다.
    timeoutWith(2000, of({
        id: 0,
        first_name: 'Hong',
        last_name: 'Gildong',
        role: 'substitute'
    }))
).subscribe(console.log, console.error)

// debounce

const { fromEvent } = rxjs
const { timeInterval, pluck, scan, tap } = rxjs.operators
const { debounceTime } = rxjs.operators

const clicks$ = fromEvent(document, 'click').pipe(
    timeInterval(),
    pluck('interval'),
    scan((acc, i) => acc + i, 0),
    tap(x => console.log('CLICKED: ' + x)),
    debounceTime(1000)
).subscribe(x => console.log('OUTPUT: -------- ' + x))


// auditTime
const { fromEvent } = rxjs
const { timeInterval, pluck, scan, tap } = rxjs.operators
const { debounceTime } = rxjs.operators

const clicks$ = fromEvent(document, 'click').pipe(
    timeInterval(),
    pluck('interval'),
    scan((acc, i) => acc + i, 0),
    tap(x => console.log('CLICKED: ' + x)),
)

const { auditTime } = rxjs.operators

clicks$.pipe(
		// time duration 뒤에 마지막으로 입력된 값을 발행
    auditTime(1000)
).subscribe(x => console.log('OUTPUT: -------- ' + x))


const { fromEvent } = rxjs
const { timeInterval, pluck, scan, tap } = rxjs.operators
const { debounceTime } = rxjs.operators

const clicks$ = fromEvent(document, 'click').pipe(
    timeInterval(),
    pluck('interval'),
    scan((acc, i) => acc + i, 0),
    tap(x => console.log('CLICKED: ' + x)),
)

const { sampleTime } = rxjs.operators

clicks$.pipe(
		// 특정 시간 마다 값을 발행하고 싶을 떄 사용한다.
    sampleTime(1000),
    timeInterval()
).subscribe(x => console.log('OUTPUT: -------- ' + x.value + ' :' + x.interval))


const { fromEvent } = rxjs
const { timeInterval, pluck, scan, tap } = rxjs.operators
const { debounceTime } = rxjs.operators

const clicks$ = fromEvent(document, 'click').pipe(
    timeInterval(),
    pluck('interval'),
    scan((acc, i) => acc + i, 0),
    tap(x => console.log('CLICKED: ' + x)),
)

const { throttleTime } = rxjs.operators

clicks$.pipe(
// leading: true의 경우 각 time duration의 첫 값을 뽑아 준다. 뒤에 나오는 값은 무시
// trailing: true의 경우 반대
// undefined -> schedular
// audittime과 차이점은 마지막 complete에서 값을 반환하는 지, 하지 않는지에 대한 차이가 있다.
    throttleTime(1000, undefined, {
    	leading: true, trailing: true
    })
).subscribe(x => console.log('OUTPUT: -------- ' + x))


const { of } = rxjs
const { ajax } = rxjs.ajax
const { concatMap, pluck } = rxjs.operators

of(3, 15, 4, 9, 1, 7).pipe(
// mergeMap과 concatMap의 차이는 '순서가 고려되어야 하는가?'이다.
    concatMap(keyword => ajax(
            `http://127.0.0.1:3000/people/${keyword}`
        ).pipe(
            pluck('response', 'first_name')
        )
    )
).subscribe(console.log)

const { range } = rxjs
const { bufferCount } = rxjs.operators

range(1, 100).pipe(
// 몇개씩 자를 것인지, 몇개씩 건너뛸 건지
  bufferCount(10, 10)
).subscribe(console.log)


const { of } = rxjs
const { every } = rxjs.operators

of(1, 3, 5, 7, 9, 11, 13, 15).pipe(
// 모두 특정 기준에 부합하는지
  every(x => x % 2 !== 0)
).subscribe(console.log)

const { fromEvent, timer } = rxjs
const { defaultIfEmpty, pluck, takeUntil } = rxjs.operators

fromEvent(document, 'click').pipe(
  takeUntil(timer(5000)),
  pluck('x'),
  // 발행이 되지 않았을 떄, 기본 값을 발행
  defaultIfEmpty('NO CLICK')
).subscribe(console.log)

const { iif, fromEvent, of } = rxjs
const { pluck } = rxjs.operators

fromEvent(document.querySelector('#check'), 'change').pipe(
  pluck('target', 'checked')
).subscribe(checked => {
  iif(
    _ => checked,
    of('CHECKED'),
    // false경우 지정해 주지 않으면 빈 스트림을 반환한다.
  ).subscribe(
    console.log,
    err => console.log(err),
    _ => console.log('COMPLETE')
  )
})

const { empty } = rxjs

// 스트림을 처리할 때, 값은 반환하지 않는 상황에서 사용한다.
empty().subscribe(console.log, console.error, _ => console.log('COMPLETE'))

const { interval } = rxjs
const { take, tap, takeLast, share } = rxjs.operators

const obs$ = interval(1000).pipe(
  take(20),
  tap(x => console.log(`side effect: ${x}`)),
  // 중간에 조인한다.
  share()
)

obs$.subscribe(x => console.log(`subscriber 1: ${x}`))

setTimeout(_ => {
  obs$.subscribe(x => console.log(`subscriber 2: ${x}`))
}, 5000)
setTimeout(_ => {
  obs$.subscribe(x => console.log(`subscriber 3: ${x}`))
}, 10000)


const { interval } = rxjs
const { take, tap, takeLast, share } = rxjs.operators

const obs$ = interval(1000).pipe(
  take(20),
  tap(x => console.log(`side effect: ${x}`)),
  // 중간에 조인한다. observable을 subject처럼 만들어 준다.
  share()
)

obs$.subscribe(x => console.log(`subscriber 1: ${x}`))

setTimeout(_ => {
  obs$.subscribe(x => console.log(`subscriber 2: ${x}`))
}, 5000)
setTimeout(_ => {
  obs$.subscribe(x => console.log(`subscriber 3: ${x}`))
}, 10000)