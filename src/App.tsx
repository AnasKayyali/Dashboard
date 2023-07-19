import { QueryClientProvider, QueryClient } from "react-query"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Datacenter from "./datacenter/Datacenter"
import Settings from "./settings/Settings"
import Login from "./login/Login"

import 'primereact/resources/themes/lara-light-indigo/theme.css'; //theme
import 'primereact/resources/primereact.min.css'; //core css
import 'primeicons/primeicons.css'; //icons
import 'primeflex/primeflex.css'; // flex

const queryClient = new QueryClient()

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}> 
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/data" element={<Datacenter />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>  
        </Router>
      </QueryClientProvider>
    </>
  )
}

export default App
