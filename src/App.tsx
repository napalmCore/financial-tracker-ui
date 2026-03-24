import { Container } from "@mui/material";
import AppBar from "./Components/AppBar.tsx";
import Router from "./Components/Router.tsx";

function App() {
  return (
    <>
    <AppBar />
    <Container maxWidth="lg" style={{ marginTop: "2rem" }} >
        <Router />
    </Container>
    </>
  )
}

export default App
