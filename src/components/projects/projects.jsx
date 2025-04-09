import "./projects.css";
import Project1 from "../../assets/project-1.png";
import Project2 from "../../assets/project-2.png";
import Project3 from "../../assets/project-3.png";

const Projects = () => {
  return (
    <>
      <h1>Projetos</h1>
      <div className="projects" id="projetos">
        <div className="project-single">
          <a href="https://redux-six-rho.vercel.app/">
            <img src={Project1} alt="Carrinho Shopping" />
            <p>Carrinho de compras interativo feito com React.js e Redux</p>
          </a>
        </div>
        <div className="project-single">
          <a href="https://netflix-login-clone-phi.vercel.app/">
            <img src={Project2} alt="Netflix landing page" />
            <p>
              Landing page da Netflix feita com React.js e estilizada com
              Tailwind
            </p>
          </a>
        </div>
        <div className="project-single last">
          <a href="https://gerenciador-de-tarefas-virid.vercel.app/">
            <img src={Project3} alt="Gerenciador de tarefas" />
            <p>
              Gerenciador de tarefas feito com React.js e a monopolização dos
              Hooks
            </p>
          </a>
        </div>
      </div>
    </>
  );
};

export default Projects;
