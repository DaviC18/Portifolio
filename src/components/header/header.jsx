import { DownloadSimple } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import "./header.css";

const Header = () => {
  const [isChecked, setIsChecked] = useState(false);
  const wrapperRef = useRef(null); // Container que engloba input, label e .links

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Se o menu estiver aberto e o clique ocorrer fora do wrapper, fecha o menu.
      if (
        isChecked &&
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target)
      ) {
        setIsChecked(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isChecked]);

  return (
    <>
      <div className="header-desktop">
        <div className="logo">
          Porti<span>folio</span>
        </div>
        <div className="links">
          <ul>
            <li>
              <a href="#home">Home</a>
            </li>
            <li>
              <a href="#sobre">Sobre mim</a>
            </li>
            <li>
              <a href="#projetos">Projetos</a>
            </li>
            <li>
              <a href="#contato">Contato</a>
            </li>
          </ul>
        </div>
        <a
          className="cv"
          href="https://drive.google.com/file/d/1KGwIp7kLrbRIn5IbwaYZp1NFVUplCRi-/view?usp=sharing"
          download={true}
        >
          <p>Download</p>
          <DownloadSimple size={20} />
        </a>
      </div>

      <div className="header-mobile">
        <div className="logo">
          Porti<span>folio</span>
        </div>
        {/* Agrupe o input, o label e os links no mesmo wrapper */}
        <div ref={wrapperRef}>
          <input
            type="checkbox"
            id="menu_checkbox"
            checked={isChecked}
            onChange={() => setIsChecked(!isChecked)}
          />
          <label
            htmlFor="menu_checkbox"
            onClick={(e) => {
              // Evita que o clique no label propague e interfira no controle externo
              e.stopPropagation();
            }}
          >
            <div></div>
            <div></div>
            <div></div>
          </label>
          <div className={`links ${isChecked ? "active" : ""}`}>
            <ul>
              <li>
                <a href="#home">Home</a>
              </li>
              <li>
                <a href="#sobre">Sobre mim</a>
              </li>
              <li>
                <a href="#projetos">Projetos</a>
              </li>
              <li>
                <a href="#contato">Contato</a>
              </li>
              <li>
                <a
                  className="cv"
                  href="https://drive.google.com/file/d/1JGwHVsqPZDgfXxdXujJaX64miM3f4_al/view?usp=drive_link"
                  download={true}
                >
                  <p>Download</p>
                  <DownloadSimple size={20} />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
