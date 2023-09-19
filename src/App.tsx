import React from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Container from "./components/layout/Container";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./components/pages/Home";
interface LayoutProps {
  children: JSX.Element;
}

const Layout = (props:LayoutProps) => {
  return (
    <Container customClass = "min-height">
      {React.cloneElement (props.children)}
    </Container>
  );
}

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element = {
          <Layout>
            <Home />
          </Layout>
        }
        />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;