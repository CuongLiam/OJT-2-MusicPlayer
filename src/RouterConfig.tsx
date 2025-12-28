import React from 'react'
import { Route, Routes } from 'react-router'
import Artists from './pages/Artist/Artists'
import Home from './pages/home/Home'
import Genre from './pages/Genre/Genre'
import MoreGenres from './pages/Genre/MoreGenres'

export default function RouterConfig() {
  return (
    <Routes>
      <Route path='/artists' element = {<Artists/>}></Route>
      <Route path='/' element = {<Home/>}></Route>
      <Route path='/genre' element = {<Genre/>}></Route>
      <Route path='/more-genres' element = {<MoreGenres/>}></Route>
    </Routes>
  )
}
