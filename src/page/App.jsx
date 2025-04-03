import "./App.css";
import Header from "../components/header/header";
import Home from "../components/home/home";
import About from "../components/about/about";
import Projects from "../components/projects/projects";
import Contact from "../components/contact/contact";

const App = () => {
  return (
    <>
      <div className="header">
        <Header />
      </div>
      <div className="body">
        <Home />
        <About />
        <Projects />
        <Contact />
      </div>
    </>
  );
};

export default App;
