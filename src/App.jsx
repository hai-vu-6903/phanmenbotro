import React, { useState, useEffect } from 'react'
import './App.css'

import WelcomeScreen from './components/WelcomeScreen'
import MenuScreen from './components/MenuScreen'
import PlayerScreen from './components/PlayerScreen'
import Quiz from './components/Quiz'
import VRPage from './components/VRPage'
import InstallPWA from './components/InstallPWA'

import usePlayer from './hooks/usePlayer'
import { preloadAllMedia } from './utils/preloadMedia'

import { nghiLeSongs, baiHatSongs, dieuVuSongs } from './data/songs'

function App() {
  const [screen, setScreen] = useState("welcome")
  const [mode, setMode] = useState("")
  const [list, setList] = useState([])

  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState({
    percent: 0,
    loadedMB: 0,
    group: ""
  })

  const player = usePlayer()

  useEffect(() => {
    async function init() {
      await preloadAllMedia(setProgress)
      setLoading(false)
    }
    init()
  }, [])

  function goMenu() {
    player.stop()
    setScreen("menu")
  }

  function selectMode(m) {
    setMode(m)
    if (m === "nghiLe") {
      setList(nghiLeSongs)
      setScreen("player")
    } else if (m === "baiHat") {
      setList(baiHatSongs)
      setScreen("player")
    } else if (m === "dieuVu") {
      setList(dieuVuSongs)
      setScreen("player")
    } else if (m === "quiz") {
      setScreen("quiz")
    } else if (m === "vrMuseum") {
      setScreen("vrmuseum")
    }
  }

  // 🔒 KHOÁ APP KHI CHƯA TẢI XONG
  if (loading) {
    return (
      <div className="offline-loader">
        <h3>Đang tải dữ liệu học offline</h3>
        <p>{progress.group}</p>
        <div className="progress">
          <div
            className="progress-bar"
            style={{ width: `${progress.percent}%` }}
          />
        </div>
        <p>{progress.percent}% – {progress.loadedMB} MB</p>
        <small>⚠ Vui lòng không tắt ứng dụng</small>
      </div>
    )
  }

  return (
    <>
      <InstallPWA />

      {screen === "welcome" && <WelcomeScreen onStart={() => setScreen("menu")} />}
      {screen === "menu" && <MenuScreen onSelect={selectMode} />}
      {screen === "player" && (
        <PlayerScreen mode={mode} list={list} onBack={goMenu} player={player} />
      )}
      {screen === "quiz" && <Quiz onBack={goMenu} />}
      {screen === "vrmuseum" && <VRPage onBack={goMenu} />}
    </>
  )
}

export default App
