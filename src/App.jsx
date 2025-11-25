import React, { useState } from 'react'
import './App.css'

import WelcomeScreen from './components/WelcomeScreen'
import MenuScreen from './components/MenuScreen'
import PlayerScreen from './components/PlayerScreen'
import Quiz from './components/Quiz'
import VRPage from './components/VRPage'
import InstallPWA from './components/InstallPWA'

import usePlayer from './hooks/usePlayer'

import { nghiLeSongs, baiHatSongs, dieuVuSongs } from './data/songs'

function App() {
  const [screen, setScreen] = useState("welcome");
  const [mode, setMode] = useState("");
  const [list, setList] = useState([]);

  const player = usePlayer();

  function goMenu() {
    player.stop();
    setScreen("menu");
  }

  function selectMode(m) {
    setMode(m);
    if (m === "nghiLe") {
      setList(nghiLeSongs);
      setScreen("player");
    } else if (m === "baiHat") {
      setList(baiHatSongs);
      setScreen("player");
    } else if (m === "dieuVu") {
      setList(dieuVuSongs);
      setScreen("player");
    } else if (m === "quiz") {
      // No need to set list for quiz
      setScreen("quiz");
    } else if (m === "vrMuseum") {
      setScreen("vrmuseum");
    }
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
