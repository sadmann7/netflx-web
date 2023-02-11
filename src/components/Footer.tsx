import Link from "next/link";

const links = [
  { lable: "FAQ", uri: "/", isExternal: false },
  { lable: "Help Center", uri: "/", isExternal: false },
  { lable: "Account", uri: "/", isExternal: false },
  { lable: "Media Center", uri: "/", isExternal: false },
  { lable: "Investor Relations", uri: "/", isExternal: false },
  { lable: "Jobs", uri: "/", isExternal: false },
  { lable: "Ways to Watch", uri: "/", isExternal: false },
  { lable: "Terms of Use", uri: "/", isExternal: false },
  { lable: "Privacy", uri: "/", isExternal: false },
  { lable: "Cookie Preferences", uri: "/", isExternal: false },
  { lable: "Corporate Information", uri: "/", isExternal: false },
  { lable: "Contact Us", uri: "/", isExternal: false },
  { lable: "Speed Test", uri: "https://fast.com/", isExternal: true },
  { lable: "Legal Notices", uri: "/", isExternal: false },
  { lable: "Only on Netflix", uri: "/", isExternal: false },
];

const Footer = () => {
  return (
    <footer
      aria-label="footer"
      className="text-content border-t-8 border-t-[#222222]"
    >
      <div className="w-[75vw] max-w-screen-lg mx-auto py-10">
        <p className="text-sm md:text-base font-medium hover:underline cursor-pointer">
          Questions? Contact us.
        </p>
        <ul className="my-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {links.map((link, i) =>
            link.isExternal ? (
              <li key={i} className="text-xs md:text-sm hover:underline">
                <a href={link.uri}>{link.lable}</a>
              </li>
            ) : (
              <li key={i} className="text-xs md:text-sm hover:underline">
                <Link href={link.uri}>{link.lable}</Link>
              </li>
            )
          )}
        </ul>
        <p className="text-xs md:text-sm">Netflix Bangladesh</p>
      </div>
    </footer>
  );
};

export default Footer;
