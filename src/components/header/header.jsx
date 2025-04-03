import { DownloadSimple } from "@phosphor-icons/react";
import "./header.css";

const Header = () => {
  return (
    <>
      <div className="headers">
        <div className="logo">
          Porti<span>folio</span>
        </div>
        <div className="links">
          <ul className="">
            <li>
              <a href="">Home</a>
            </li>
            <li>
              <a href="">About</a>
            </li>
            <li>
              <a href="">Projects</a>
            </li>
            <li>
              <a href="">Contact</a>
            </li>
          </ul>
        </div>
        <div className="cv">
          <p>Download</p>
          <DownloadSimple size={20} />
        </div>
      </div>
    </>
  );
};

export default Header;
