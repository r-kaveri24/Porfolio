import { link } from "fs";

const footerLinks = [
  {
    title: "LinkdIN",
    link: "#",
  },
  {
    title: "Twitter",
    link: "#",
  },
  {
    title: "Github",
    link: "#",
  },
  {
    title: "Best Project",
    link: "#",
  },
]

export const Footer = () => {
  return <footer>

    <div className="container">
      <div>
        <div>&copy; 2024. All rights reserved.</div>
        <nav>
          {footerLinks.map(link => (
            <span>{link.title}</span>
          ))}
        </nav>
      </div>
    </div>
  </footer>;
};
