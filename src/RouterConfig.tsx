import React from 'react'
import { Route, Routes } from 'react-router'
import Artists from './pages/Artist/Artists'

export default function RouterConfig() {
  return (
    <Routes>
      <Route path='/artists' element = {<Artists/>}></Route>
    </Routes>
  )
}
