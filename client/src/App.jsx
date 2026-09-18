import Navbar from "./components/Navbar/Navbar.jsx";
import ThemeToggle from "./components/ThemeToggle/ThemeToggle.jsx";
import Hero from "./components/Hero/Hero.jsx";
import Highlights from "./components/Highlights/Highlights.jsx";
import About from "./components/About/About.jsx";
import Experience from "./components/Experience/Experience.jsx";
import Skills from "./components/Skills/Skills.jsx";
import Projects from "./components/Projects/Projects.jsx";
import Contact from "./components/Contact/Contact.jsx";
import Footer from "./components/Footer/Footer.jsx";
import ScrollProgress from "./components/ScrollProgress/ScrollProgress.jsx";
import BackToTop from "./components/BackToTop/BackToTop.jsx";

function App() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <Highlights />
        <About />
        <Experience />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
      <ThemeToggle />
      <BackToTop />
    </>
  );
}

export default App;
