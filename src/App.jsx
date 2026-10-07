import { BrowserRouter, Routes, Route } from "react-router-dom"
import Header from "./components/Header"
import Footer from "./components/Footer"
import Home from "./pages/Home"
import Registration from "./pages/Registration"

function App() {
  return (
    <BrowserRouter>
      {/* Remove the old div and put a simpler one */}
      <div className="flex flex-col min-h-screen"> 
        <Header />

        {/* Change is here too. Use main for content */}
        <main className="flex1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/registration" element={<Registration />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App