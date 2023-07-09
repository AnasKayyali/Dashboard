import { QueryClientProvider, QueryClient } from "react-query"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Manage_Datacenters from "./Components/Manage_Datacenters"
import Manage_Settings from "./Components/Manage_Settings"
import Login from "./Components/Login"

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
            <Route path="/data" element={<Manage_Datacenters />} />
            <Route path="/settings" element={<Manage_Settings />} />
          </Routes>  
        </Router>
      </QueryClientProvider>
    </>
  )
}

export default App
