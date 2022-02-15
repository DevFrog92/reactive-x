import rxjs from "rxjs"

// const { of, from, range, generate } = rxjs

// // of: 해당 함수에 들어간 인자를 시퀀스로 그대로 내보내고, 완료 알림을 보낸다.
// const obs1$ = of(1, 2, 3, 4, 5)
// // from: 배열을 인자로 받는다.
// const obs2$ = from([6, 7, 8, 9, 10])
// // range
// const obs3$ = range(11, 5)
// // generate: for문과 비슷하다. 조건과, 증감 조건에 대해서 인자로 전달한다.
// const obs4$ = generate(
//   15, x => x < 30, x => x + 2
// )

// obs1$.subscribe(item => console.log(`of: ${item}`))
// obs2$.subscribe(item => console.log(`from: ${item}`))
// obs3$.subscribe(item => console.log(`range: ${item}`))
// obs4$.subscribe(item => console.log(`generate: ${item}`))


// 시간에 의한 스트림
// const { interval, timer } = rxjs

// const obs1$ = interval(1000)
// const obs2$ = timer(3000)

// obs1$.subscribe(item => console.log(`interval: ${item}`))
// obs2$.subscribe(item => console.log(`timer: ${item}`))

const { fromEvent } = rxjs

const obs1$ = fromEvent(document, 'click')
const obs2$ = fromEvent(document.getElementById('myInput'), 'keypress')

obs1$.subscribe(item => console.log(item))
obs2$.subscribe(item => console.log(item))

const { Observable } = rxjs

const obs$ = new Observable(subscriber => {
	// next 함수: 발행되는 값으로 subscribe 내부 함수를 실행한다.
  subscriber.next(1)
  subscriber.next(2)
  subscriber.next(3)

  // 값을 다 발행한 뒤에는 complete를 실행하여 메모리 해제
  subscriber.complete()

  // 시간에 관한 custom 스트림을 만들 수 있다.
  let i = 4
  setInterval(_ => subscriber.next(i++), 1000)
})

obs$.subscribe(item => console.log(item))


// Observable은 lazy(게으르다)
// subscribe가 있어야만 발행을 시작한다.
// 각 subscribe에 따로 발행

const { of, interval, fromEvent } = rxjs

const obs1$ = of('a', 'b', 'c')
const obs2$ = interval(1000)
const obs3$ = fromEvent(document, 'click')

setTimeout(_ => {
  console.log('of 구독 시작')
  obs1$.subscribe(item => console.log(item))
}, 5000)
setTimeout(_ => {
  console.log('interval 구독 시작')
  obs2$.subscribe(item => console.log(item))
}, 10000)
setTimeout(_ => {
  console.log('fromEvent 구독 시작')
  obs3$.subscribe(_ => console.log('click!'))
}, 15000)
setTimeout(_ => {
  console.log('interval 구독 시작 2')
  obs2$.subscribe(item => console.log(item))
}, 20000)


// tap: pipe를 거치는 동작에서 미리 한번 실행시켜 보고 싶을 때 사용한다.


const { BehaviorSubject } = rxjs
const subject = new BehaviorSubject(0) // 초기값이 있음

subject.subscribe((x) => console.log('A: ' + x))

subject.next(1)
subject.next(2)
subject.next(3)

// A가 마지막으로 발행받은 값을 가지고 있다.
subject.subscribe((x) => console.log('B: ' + x))

subject.next(4)
subject.next(5)

const { AsyncSubject } = rxjs
// complete 실행 후 마지막 값을 반환한다.
const subject = new AsyncSubject()

subject.subscribe((x) => console.log('A: ' + x))

subject.next(1)
subject.next(2)
subject.next(3)

subject.subscribe((x) => console.log('B: ' + x))

subject.next(4)
subject.next(5)

subject.subscribe((x) => console.log('C: ' + x))

subject.next(6)
subject.next(7)
subject.complete()