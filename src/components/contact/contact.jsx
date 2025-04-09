import "./contact.css";
import Github from "../../assets/github.png";
import Linkedin from "../../assets/linkedin.png";
import Instagram from "../../assets/instagram.png";
import Whatsapp from "../../assets/whatsapp.png";

const Contact = () => {
  return (
    <>
      <div className="contacts" id="contato">
        <h1>Contatos</h1>
        <div className="contact-wrapper">
          <div className="contact-single">
            <div className="github">
              <a href="https://github.com/DaviC18">
                <img src={Github} alt="Github" />
              </a>
            </div>
          </div>
          <div className="contact-single">
            <div className="linke">
              <a href="https://www.linkedin.com/in/davi-curty-84b2a0285">
                <img src={Linkedin} alt="Linkedin" />
              </a>
            </div>
          </div>
          <div className="contact-single">
            <div className="insta">
              <a href="https://www.instagram.com/davi.curty.739/">
                <img src={Instagram} alt="Instagram" />
              </a>
            </div>
          </div>
          <div className="contact-single">
            <div className="whats">
              <img src={Whatsapp} alt="Whatsapp" />
              <div className="number">
                <div className="base">
                  <p>+55 (24) 98828-4001</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="line"></div>
      </div>
    </>
  );
};

export default Contact;
