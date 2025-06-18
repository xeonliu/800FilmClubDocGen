import React from 'react'
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import type { Movie } from './model/movie'
import type { Schedule } from './model/schedule'

import MovieTable from './component/movie_table'
import ScheduleTable from './component/schedule'

function App() {
  const [count, setCount] = useState(0)
  const movie: Movie = {
    chinese: "霸王别姬",
    foreign: "Farewell My Concubine",
    year: "1993",
    director: "陈凯歌",
    writer: "芦苇 / 李碧华",
    actors: "张国荣 / 张丰毅 / 巩俐",
    genre: "剧情 / 爱情 / 同性",
    region: "中国大陆 / 香港",
    length: "171",
    douban: "9.6",
    desc: "影片讲述了两位京剧艺人生涯与情感的纠葛。",
    short: "一生所爱，终成空。",
  }

  const schedule: Schedule = {
    movies: [
      {
        ...movie,
        isSalon: false,
        showDate: "2025-04-13",
        startTime: "18:30",
        endTime: "21:00",
      },
      {
        ...movie,
        isSalon: true,
        showDate: "2025-04-14",
        startTime: "18:30",
        endTime: "21:00",
      },
    ]
  }

  return (
    <>
      <MovieTable movie={movie} />
      <ScheduleTable schedule={schedule} />
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
